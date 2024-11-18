const axios = require("axios");

let io;

// This function will allow you to pass the socket.io instance to the controller
exports.setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};

exports.fetchAlarmsFromExternalApi = async (req, res) => {
  const apiUrl =
    "https://api.netbiter.net/operation/v1/rest/json/system/0030116A465A/alarm";
  const accessKey = "AFC1860F2D5B8493C0109E77329EE74D";

  try {
    const response = await axios.get(`${apiUrl}?accesskey=${accessKey}`);
    const alarms = response.data;

    // Emit the alarms to all connected clients
    if (io) {
      io.emit("newAlarm", alarms); // Emit alarm data to the clients
    }
    return res.status(200).json(alarms);
  } catch (error) {
    console.error("Error fetching alarms:", error.message);

    // Additional logging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Unknown error:", error.message);
    }

    res
      .status(500)
      .json({ message: "Error fetching alarms from external API" });
  }
};
