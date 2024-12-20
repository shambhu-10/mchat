const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  "https://mchatfrontend.onrender.com", // Deployed frontend
  "http://localhost:3000",             // Local development frontend
];

// Middleware for CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
}));

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Array of allowed origins
    methods: ["GET", "POST"],
  },
});

// Socket.io event listeners
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // User joins a room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // User sends a message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // User disconnects
  socket.on("disconnect", () => {
    
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Define the port for Render
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
