const express = require("express");
const cors = require("cors");
const ArgosRoutes = require("./Routes/GetAlarms/Argos");
const socketIo = require("socket.io");
const http = require("http");
const alarmsController = require("./Contollers/GetAlarms/Argos");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS settings
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow the client URL
    methods: ["GET", "POST"], // Allow the required methods
    credentials: true, // Allow cookies or session if needed
  },
});

// Middleware to parse JSON bodies
app.use(express.json());

// Pass the socket.io instance to the controller
alarmsController.setSocketIo(io);

// Enable CORS for all Express routes
app.use(
  cors({
    origin: "http://localhost:3000", // Allow the client URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials
  })
);

const pollAlarms = async () => {
  try {
    await alarmsController.fetchAlarmsFromExternalApi();
  } catch (error) {
    console.error("Error during alarm polling:", error.message);
  }
};

// Poll the alarms every 10 seconds
setInterval(pollAlarms, 10000);

// Routing
app.use("/", ArgosRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
