const { Server } = require("socket.io");
const Project = require("../models/projectModel");

const PROJECT_ROOM = (projectId) => `project:${projectId}`;

// Keep pending saves per project.
// This prevents MongoDB from being updated for every socket event.
const pendingSaves = new Map();

const SAVE_DELAY = 500;

const saveProjectContent = async (projectId, content) => {
  try {
    await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          content,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log(`Project ${projectId} content saved`);
  } catch (error) {
    console.error(
      `Failed to save project ${projectId}:`,
      error.message
    );
  }
};

const scheduleContentSave = (projectId, content) => {
  const existingTimer = pendingSaves.get(projectId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(async () => {
    pendingSaves.delete(projectId);

    await saveProjectContent(projectId, content);
  }, SAVE_DELAY);

  pendingSaves.set(projectId, timer);
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ==========================================
    // JOIN PROJECT
    // ==========================================

    socket.on("join:project", async ({ projectId }) => {
      try {
        if (!projectId) return;

        const project = await Project.findById(projectId)
          .select("content title members owner");

        if (!project) {
          socket.emit("project:error", {
            message: "Project not found",
          });

          return;
        }

        const room = PROJECT_ROOM(projectId);

        socket.join(room);

        // Store projectId on socket
        socket.projectId = projectId;

        console.log(
          `Socket ${socket.id} joined ${room}`
        );

        // Send current document to the user
        socket.emit("doc:init", {
          content: project.content || "",
          meta: {
            _id: project._id,
            title: project.title,
            owner: project.owner,
            lastModified: project.updatedAt,
          },
        });

      } catch (error) {
        console.error(
          "join:project error:",
          error.message
        );

        socket.emit("project:error", {
          message: "Unable to join project",
        });
      }
    });

    // ==========================================
    // DOCUMENT UPDATE
    // ==========================================

    socket.on("doc:update", ({ projectId, content }) => {
      try {
        if (!projectId) return;

        if (typeof content !== "string") {
          return;
        }

        const room = PROJECT_ROOM(projectId);

        // Save to MongoDB after debounce
        scheduleContentSave(projectId, content);

        // Immediately update other connected users
        socket.to(room).emit("doc:remoteUpdate", {
          content,
        });

      } catch (error) {
        console.error(
          "doc:update error:",
          error.message
        );
      }
    });

    // ==========================================
    // ADD COMMENT
    // ==========================================

    socket.on(
      "comment:add",
      ({ projectId, comment }) => {
        if (!projectId || !comment) return;

        const room = PROJECT_ROOM(projectId);

        socket.to(room).emit("comment:added", comment);
      }
    );

    // ==========================================
    // RESOLVE COMMENT
    // ==========================================

    socket.on(
      "comment:resolve",
      ({ projectId, commentId }) => {
        if (!projectId || !commentId) return;

        const room = PROJECT_ROOM(projectId);

        socket.to(room).emit("comment:resolved", {
          commentId,
        });
      }
    );

    // ==========================================
    // LEAVE PROJECT
    // ==========================================

    socket.on("leave:project", ({ projectId }) => {
      if (!projectId) return;

      const room = PROJECT_ROOM(projectId);

      socket.leave(room);

      console.log(
        `Socket ${socket.id} left ${room}`
      );
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.id}`,
        reason
      );
    });
  });

  return io;
};

module.exports = initializeSocket;