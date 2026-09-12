const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

const PROJECT_ROOM = (projectId) => `project:${projectId}`;
const SAVE_DELAY = 500;
const pendingSaves = new Map();

const canAccessProject = (project, userId) => {
  if (!project) return false;
  if (project.owner.toString() === userId.toString()) return true;
  return project.members.some((member) => member.toString() === userId.toString());
};

const persistProjectContent = async (projectId, content, userId) => {
  const project = await Project.findById(projectId).select("owner members");

  if (!project || !canAccessProject(project, userId)) {
    throw new Error("Project access denied");
  }

  await Project.findByIdAndUpdate(
    projectId,
    { $set: { content } },
    { runValidators: true }
  );
};

const scheduleContentSave = (projectId, content, userId) => {
  const existing = pendingSaves.get(projectId);
  if (existing) clearTimeout(existing.timer);

  const timer = setTimeout(async () => {
    pendingSaves.delete(projectId);
    try {
      await persistProjectContent(projectId, content, userId);
      console.log(`Document ${projectId} saved to MongoDB`);
    } catch (error) {
      console.error(`Failed to save document ${projectId}:`, error.message);
    }
  }, SAVE_DELAY);

  pendingSaves.set(projectId, { timer, content, userId });
};

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return next(new Error("User not found"));

    socket.user = user;
    return next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);
    return next(new Error("Invalid or expired token"));
  }
};

const initializeSocket = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: false,
    },
    transports: ["websocket", "polling"],
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user.email})`);

    socket.on("join:project", async ({ projectId } = {}) => {
      try {
        if (!projectId) return;

        const project = await Project.findById(projectId).select(
          "content title owner members updatedAt"
        );

        if (!project) {
          return socket.emit("project:error", { message: "Project not found" });
        }

        if (!canAccessProject(project, socket.user._id)) {
          return socket.emit("project:error", { message: "Access denied" });
        }

        const room = PROJECT_ROOM(projectId);
        socket.join(room);
        socket.projectId = projectId;

        socket.emit("doc:init", {
          content: project.content || "",
          meta: {
            _id: project._id,
            title: project.title,
            owner: project.owner,
            members: project.members,
            lastModified: project.updatedAt,
          },
        });

        const roomSockets = await io.in(room).fetchSockets();
        io.to(room).emit("presence:update", {
          collaborators: roomSockets.map((client) => ({
            id: client.user._id.toString(),
            name: client.user.name,
            email: client.user.email,
            status: "online",
            role: client.user._id.toString() === project.owner.toString() ? "Owner" : "Editor",
            isTyping: false,
            color: "#2563EB",
          })),
        });
      } catch (error) {
        console.error("join:project error:", error.message);
        socket.emit("project:error", { message: "Unable to join project" });
      }
    });

    socket.on("doc:update", ({ projectId, content, clientId } = {}) => {
      if (!projectId || typeof content !== "string") return;
      if (socket.projectId !== projectId) return;

      scheduleContentSave(projectId, content, socket.user._id);

      socket.to(PROJECT_ROOM(projectId)).emit("doc:remoteUpdate", {
        content,
        clientId,
        userId: socket.user._id.toString(),
      });
    });

    socket.on("presence:update", ({ projectId, isTyping, cursorPosition } = {}) => {
      if (!projectId || socket.projectId !== projectId) return;
      socket.to(PROJECT_ROOM(projectId)).emit("presence:user", {
        user: {
          id: socket.user._id.toString(),
          name: socket.user.name,
          email: socket.user.email,
          status: "online",
          isTyping: Boolean(isTyping),
          cursorPosition: cursorPosition || null,
          color: "#2563EB",
        },
      });
    });

    socket.on("chat:message", ({ projectId, message } = {}) => {
      if (!projectId || !message || socket.projectId !== projectId) return;
      socket.to(PROJECT_ROOM(projectId)).emit("chat:message", message);
    });

    socket.on("comment:add", ({ projectId, comment } = {}) => {
      if (!projectId || !comment || socket.projectId !== projectId) return;
      socket.to(PROJECT_ROOM(projectId)).emit("comment:added", comment);
    });

    socket.on("comment:resolve", ({ projectId, commentId } = {}) => {
      if (!projectId || !commentId || socket.projectId !== projectId) return;
      socket.to(PROJECT_ROOM(projectId)).emit("comment:resolved", { commentId });
    });

    socket.on("leave:project", ({ projectId } = {}) => {
      if (!projectId) return;
      socket.leave(PROJECT_ROOM(projectId));
      socket.projectId = null;
    });

    socket.on("disconnect", async () => {
      if (!socket.projectId) return;
      const room = PROJECT_ROOM(socket.projectId);
      const roomSockets = await io.in(room).fetchSockets();
      io.to(room).emit("presence:update", {
        collaborators: roomSockets.map((client) => ({
          id: client.user._id.toString(),
          name: client.user.name,
          email: client.user.email,
          status: "online",
          isTyping: false,
          color: "#2563EB",
        })),
      });
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
