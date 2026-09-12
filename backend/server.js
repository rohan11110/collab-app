const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const initializeSocket = require("./services/socket.service");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "CollabDocs API" });
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

const io = initializeSocket(server, allowedOrigins);
app.set("io", io);

app.use((error, req, res, next) => {
  console.error("Unhandled API error:", error);
  if (res.headersSent) return next(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

const PORT = Number(process.env.PORT) || 5001;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO running on http://localhost:${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});
