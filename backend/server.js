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

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const io = initializeSocket(server);

// Make socket available to other parts of app
app.set("io", io);

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO running on port ${PORT}`);
});