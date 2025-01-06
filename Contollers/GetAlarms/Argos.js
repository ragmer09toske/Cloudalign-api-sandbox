const axios = require("axios");
let io;
require("dotenv").config();

// Pass the socket.io instance to the controller
exports.setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};
exports.listenAndExportAlarms = async (req, res) => {
  const apiUrl = `https://api.netbiter.net/operation/v1/rest/json/system/${process.env.SYSTEM_ID}/alarm`;
  const accessKey = process.env.ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Access key is not defined in environment variables.");
  }

  try {
    const response = await axios.get(`${apiUrl}?accesskey=${accessKey}`);
    const alarms = response.data;

    if (!Array.isArray(alarms)) {
      throw new Error("Invalid response format: expected an array.");
    }

    // Return all alarms as a JSON response
    return res.status(200).json(alarms);
  } catch (error) {
    console.error("Error fetching alarms:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return res
      .status(error.response?.status || 500)
      .json({ message: "Error fetching alarms from external API" });
  }
};

exports.fetchAlarmsFromExternalApi = async (req, res) => {
  const apiUrl = `https://api.netbiter.net/operation/v1/rest/json/system/${process.env.SYSTEM_ID}/alarm`;
  const accessKey = process.env.ACCESS_KEY;
  const alarmPostUrl = "https://alarm-test.vodacom.co.za";
  const username = "appduser";
  const password = "netcool_appd";

  if (!accessKey) {
    throw new Error("Access key is not defined in environment variables.");
  }

  try {
    const response = await axios.get(`${apiUrl}?accesskey=${accessKey}`);
    const alarms = response.data;

    if (!Array.isArray(alarms)) {
      throw new Error("Invalid response format: expected an array.");
    }

    // Transform and emit each alarm individually
    for (const alarm of alarms) {
      const transformedAlarm = {
        event_name: "VC_AA_VSA1_Traffic_No_load",
        alias: "Ongoing Critical Health Rule Violation",
        tags: ["AppDynamics"],
        event_guid: "de821254-491c-47cb-9c06-1f79b3d255cb",
        event_id: alarm.id,
        policy: "3_VC_ENGFUSION_VSA1_DB_Remote_Critical_Netcool_Push",
        event_time: new Date(alarm.timestamp).toUTCString(),
        app_id: alarm.systemId,
        app_name: alarm.deviceName,
        event_message: `AppDynamics has detected a problem with Backend. ${alarm.name} continues to violate with <critical>.`,
        severity: (() => {
          switch (alarm.severity) {
            case 0:
              return "Indeterminate";
            case 1:
              return "Critical";
            case 2:
              return "Major";
            case 3:
              return "Minor";
            case 4:
              return "Warning";
            case 5:
              return "Cleared";
            default:
              return "Unknown";
          }
        })(),
        event_deep_link: `https://vodacomsa-prod.saas.appdynamics.com/#location=APP_EVENT_VIEWER_MODAL&eventSummary=${alarm.id}&application=${alarm.systemId}`,
        controller_url: "https://vodacomsa-prod.saas.appdynamics.com",
        node_id: alarm.id,
        node_name: alarm.deviceName,
        summary: `AppDynamics has detected a problem with Backend. ${alarm.name} continues to violate with <critical>.`,
        event_type: "POLICY_CONTINUES_CRITICAL",
        entity_name: alarm.name,
        tech_type: "BACKEND",
        health_rule_id: "128865",
        health_rule_name: "VC_AA_VSA1_Traffic_No_load",
        incident_id: alarm.id,
        incident_name: alarm.name,
      };

      // Emit each alarm individually
      if (io) io.emit("newAlarm", transformedAlarm);

      // Send each alarm to the additional endpoint
      const authConfig = {
        auth: { username, password },
      };
    }

    if (res)
      return res.status(200).json({ message: "Alarms processed successfully" });
  } catch (error) {
    console.error("Error fetching alarms:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    if (res) {
      return res
        .status(error.response?.status || 500)
        .json({ message: "Error fetching alarms from external API" });
    }
    throw error;
  }
};
