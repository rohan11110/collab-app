const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const DocumentVersion = require("../models/versionModel");

const PROJECT_ROOM = (projectId) => `project:${projectId}`;
const pendingSaves = new Map();
const SAVE_DELAY = 600;
const VERSION_COOLDOWN = 15000;
const lastVersionAt = new Map();

const safeUser = (user) => ({
  id: user._id?.toString?.() || user.id?.toString?.(),
  name: user.name || "User",
  email: user.email || "",
  color: user.color || "#2563EB",
  role: user.role || "editor",
});

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    next(new Error("Not authorized"));
  }
};

const saveProjectContent = async ({ projectId, content, userId, reason = "Autosave" }) => {
  const project = await Project.findById(projectId).select("content title members owner");
  if (!project) return false;

  const allowed = project.members.some((member) => member.toString() === userId.toString());
  if (!allowed) return false;

  project.content = content;
  await project.save();

  const previousVersionAt = lastVersionAt.get(projectId) || 0;
  const now = Date.now();

  if (now - previousVersionAt >= VERSION_COOLDOWN || reason === "Restored version") {
    await DocumentVersion.create({
      project: project._id,
      content,
      title: project.title,
      createdBy: userId,
      reason,
    });
    lastVersionAt.set(projectId, now);
  }

  return true;
};

const scheduleContentSave = (payload, socket) => {
  const existing = pendingSaves.get(payload.projectId);
  if (existing) clearTimeout(existing.timer);

  const timer = setTimeout(async () => {
    pendingSaves.delete(payload.projectId);
    const saved = await saveProjectContent(payload);
    if (saved) {
      socket.emit("doc:saved", {
        updatedAt: new Date().toISOString(),
      });
    }
  }, SAVE_DELAY);

  pendingSaves.set(payload.projectId, { timer, payload });
};

const initializeSocket = (server) => {
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.data.projects = new Set();
    console.log(`Socket connected: ${socket.id} (${socket.user.email})`);

    socket.on("join:project", async ({ projectId } = {}) => {
      try {
        if (!projectId) return;

        const project = await Project.findById(projectId).select(
          "content title owner members updatedAt"
        );

        if (!project) {
          socket.emit("project:error", { message: "Project not found" });
          return;
        }

        const isMember = project.members.some(
          (member) => member.toString() === socket.user._id.toString()
        );

        if (!isMember) {
          socket.emit("project:error", { message: "Access denied" });
          return;
        }

        const room = PROJECT_ROOM(projectId);
        socket.join(room);
        socket.data.projects.add(projectId.toString());

        socket.emit("doc:init", {
          content: project.content || "",
          meta: {
            _id: project._id,
            title: project.title,
            owner: project.owner,
            lastModified: project.updatedAt,
          },
        });

        const members = await User.find({ _id: { $in: project.members } }).select("name email");
        const collaborators = members.map((user) => ({ ...safeUser(user), status: "online" }));
        io.to(room).emit("presence:update", { collaborators });

        socket.to(room).emit("presence:user", {
          user: { ...safeUser(socket.user), status: "online", isTyping: false },
        });
      } catch (error) {
        console.error("join:project error:", error.message);
        socket.emit("project:error", { message: "Unable to join project" });
      }
    });

    socket.on("doc:update", async ({ projectId, content, clientId } = {}) => {
      if (!projectId || typeof content !== "string") return;
      if (!socket.data.projects.has(projectId.toString())) return;

      socket.to(PROJECT_ROOM(projectId)).emit("doc:remoteUpdate", {
        content,
        clientId,
        userId: socket.user._id.toString(),
        updatedAt: new Date().toISOString(),
      });

      scheduleContentSave({
        projectId,
        content,
        userId: socket.user._id,
      }, socket);
    });

    socket.on("presence:update", ({ projectId, isTyping = false, cursorPosition = null } = {}) => {
      if (!projectId || !socket.data.projects.has(projectId.toString())) return;

      socket.to(PROJECT_ROOM(projectId)).emit("presence:user", {
        user: {
          ...safeUser(socket.user),
          status: "online",
          isTyping: Boolean(isTyping),
          cursorPosition,
        },
      });
    });

    socket.on("chat:message", async ({ projectId, message } = {}) => {
      if (!projectId || !message?.content || !socket.data.projects.has(projectId.toString())) return;

      const project = await Project.findById(projectId).select("members");
      if (!project || !project.members.some((member) => member.toString() === socket.user._id.toString())) return;

      const clean = {
        clientId: message.clientId || `${Date.now()}-${Math.random()}`,
        user: socket.user._id,
        content: String(message.content).trim(),
      };

      await Project.findByIdAndUpdate(projectId, {
        $push: { messages: clean },
      });

      const payload = {
        id: clean.clientId,
        user: safeUser(socket.user),
        content: clean.content,
        timestamp: new Date().toISOString(),
      };

      socket.to(PROJECT_ROOM(projectId)).emit("chat:message", payload);
      socket.emit("chat:ack", payload);
    });

    socket.on("comment:add", async ({ projectId, comment } = {}) => {
      if (!projectId || !comment?.text || !socket.data.projects.has(projectId.toString())) return;

      const clean = {
        clientId: comment.clientId || `${Date.now()}-${Math.random()}`,
        user: socket.user._id,
        text: String(comment.text),
        selection: String(comment.selection || ""),
        resolved: false,
        position: comment.position || { top: 0, left: 0 },
      };

      await Project.findByIdAndUpdate(projectId, { $push: { comments: clean } });

      const payload = {
        id: clean.clientId,
        user: safeUser(socket.user),
        text: clean.text,
        selection: clean.selection,
        resolved: false,
        position: clean.position,
        timestamp: new Date().toISOString(),
      };

      socket.to(PROJECT_ROOM(projectId)).emit("comment:added", payload);
      socket.emit("comment:ack", payload);
    });

    socket.on("comment:resolve", async ({ projectId, commentId } = {}) => {
      if (!projectId || !commentId || !socket.data.projects.has(projectId.toString())) return;

      await Project.updateOne(
        { _id: projectId, "comments.clientId": commentId },
        { $set: { "comments.$.resolved": true } }
      );

      io.to(PROJECT_ROOM(projectId)).emit("comment:resolved", { commentId });
    });

    socket.on("leave:project", ({ projectId } = {}) => {
      if (!projectId) return;
      socket.leave(PROJECT_ROOM(projectId));
      socket.data.projects.delete(projectId.toString());
    });

    socket.on("disconnect", () => {
      for (const projectId of socket.data.projects || []) {
        socket.to(PROJECT_ROOM(projectId)).emit("presence:leave", {
          userId: socket.user._id.toString(),
        });
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
