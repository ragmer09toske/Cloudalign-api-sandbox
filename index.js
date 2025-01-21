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

let pollingInterval = 60000000; // Initial polling interval
let pollingActive = false;

// Polling function
const pollAlarms = async () => {
  if (!pollingActive) return;
  try {
    await alarmsController.fetchAlarmsFromExternalApi();
  } catch (error) {
    handlePollingError(error);
  } finally {
    setTimeout(pollAlarms, pollingInterval);
  }
};

// Handle the 403 error and adjust polling interval
const handlePollingError = (error) => {
  if (error.response?.status === 403) {
    console.error(
      "403 Error: Access denied. Attempting to adjust polling interval."
    );

    if (error.response.data.code === 1700) {
      adjustPollingInterval(error.response.data.message);
    } else {
      console.error("Unexpected 403 error code:", error.response.data.code);
    }
  } else {
    console.error("Error during alarm polling:", error.message);
  }
};

// Adjust polling interval based on the error message from the server
const adjustPollingInterval = (message) => {
  const nextRefillMatch = message.match(/Next refill \(UTC time\) ([^)]*)/);
  if (nextRefillMatch) {
    const nextRefillTime = new Date(nextRefillMatch[1]);
    if (!isNaN(nextRefillTime)) {
      const delay = nextRefillTime - new Date();
      pollingInterval = delay > 0 ? delay : 6000000; // Set polling interval to next refill time or default to 1 hour
      console.log(`Adjusted polling interval to: ${pollingInterval}ms`);
    } else {
      console.error("Failed to parse next refill time.");
    }
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

    let pollingInterval = 200000; // Start with a long polling interval (10 minutes)
    let pollingActive = true;
    let backoffFactor = 1.5; // Exponential backoff factor
    let maxPollingInterval = 3600000; // Set a maximum polling interval (1 hour)

    // Polling function
    const pollAlarms = async () => {
      if (!pollingActive) return;
      try {
        await alarmsController.fetchAlarmsFromExternalApi();
      } catch (error) {
        handlePollingError(error);
      } finally {
        setTimeout(pollAlarms, pollingInterval);
      }
    };

    // Handle the 403 error and adjust polling interval
    const handlePollingError = (error) => {
      if (error.response?.status === 403) {
        console.error(
          "403 Error: Access denied. Attempting to adjust polling interval."
        );

        if (error.response.data.code === 1700) {
          adjustPollingInterval(error.response.data.message);
        } else {
          console.error("Unexpected 403 error code:", error.response.data.code);
          applyExponentialBackoff(); // Apply exponential backoff for general errors
        }
      } else {
        console.error("Error during alarm polling:", error.message);
      }
    };

    // Adjust polling interval based on the error message from the server
    const adjustPollingInterval = (message) => {
      const nextRefillMatch = message.match(/Next refill \(UTC time\) ([^)]*)/);
      if (nextRefillMatch) {
        const nextRefillTime = new Date(nextRefillMatch[1]);
        if (!isNaN(nextRefillTime)) {
          const delay = nextRefillTime - new Date();
          pollingInterval = delay > 0 ? delay : 6000000; // Set polling interval to next refill time or default to 10 minutes
          console.log(`Adjusted polling interval to: ${pollingInterval}ms`);
        } else {
          console.error("Failed to parse next refill time.");
        }
      } else {
        console.error("Unable to extract refill time from message.");
      }
    };

    // Apply exponential backoff to the polling interval
    const applyExponentialBackoff = () => {
      pollingInterval = Math.min(
        pollingInterval * backoffFactor,
        maxPollingInterval
      );
      console.log(
        `Exponential backoff applied. New polling interval: ${pollingInterval}ms`
      );
    };

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
  } else {
    console.error("Unable to extract refill time from message.");
  }
};

// Start polling
// pollAlarms();

app.use("/", ArgosRoutes);

server.on("close", () => {
  pollingActive = false;
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
