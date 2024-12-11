/**
 * @fileoverview Main server file for the Cloudalign-API application.
 * Configures and starts the Express server, sets up routes, and handles alarm polling.
 */

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

const io = socketIo(server, {
  path: "/api/socket.io",
  cors: {
    origin: ["http://localhost:3000", "https://netcloud-opal.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
alarmsController.setSocketIo(io);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://netcloud-opal.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

let pollingInterval = 100000;
let pollingActive = true;

/**
 * Polls alarms from an external API at a specified interval.
 * Adjusts the polling interval based on the response from the API.
 * If the API returns a 403 status with a specific error code, the polling interval is adjusted to the next refill time.
 * Logs errors encountered during polling.
 */
const pollAlarms = async () => {
  if (!pollingActive) return;
  try {
    await alarmsController.fetchAlarmsFromExternalApi();
  } catch (error) {
    if (error.response?.status === 403 && error.response.data.code === 1700) {
      const nextRefillMatch = error.response.data.message.match(
        /Next refill \(UTC time\) ([^)]*)/
      );
      if (nextRefillMatch) {
        const nextRefillTime = new Date(nextRefillMatch[1]);
        if (!isNaN(nextRefillTime)) {
          const delay = nextRefillTime - new Date();
          pollingInterval = delay > 0 ? delay : 600000;
        }
      }
    } else {
      console.error("Error during alarm polling:", error.message);
    }
  } finally {
    setTimeout(pollAlarms, pollingInterval);
  }
};

pollAlarms();

app.use("/", ArgosRoutes);

server.on("close", () => {
  pollingActive = false;
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
