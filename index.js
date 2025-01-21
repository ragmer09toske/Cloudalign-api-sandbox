require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ArgosRoutes = require("./Routes/GetAlarms/Argos");
const socketIo = require("socket.io");
const http = require("http");
const alarmsController = require("./Contollers/GetAlarms/Argos");
const { localEnv_3000_url, production_url } = require("./Constants");
const { listenAndExportAlarms } = require("./Contollers/GetAlarms/Argos");

const app = express();
const server = http.createServer(app);

// const io = socketIo(server, {
//   path: "/api/socket.io",
//   cors: {
//     origin: ["http://localhost:3000", "https://netcloud-opal.vercel.app"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

app.use(express.json());
// alarmsController.setSocketIo(io);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://netcloud-opal.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// let pollingInterval = 60000000; // Initial polling interval
// let pollingActive = false;

// Polling function
// const pollAlarms = async () => {
//   if (!pollingActive) return;
//   try {
//     await alarmsController.fetchAlarmsFromExternalApi();
//   } catch (error) {
//     handlePollingError(error);
//   } finally {
//     setTimeout(pollAlarms, pollingInterval);
//   }
// };

// Handle the 403 error and adjust polling interval

// Start polling
// pollAlarms();

app.use("/", ArgosRoutes);

// server.on("close", () => {
//   pollingActive = false;
// });

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
