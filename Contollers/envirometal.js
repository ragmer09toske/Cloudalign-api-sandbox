const Generic = require("../models/Generic_Model");

exports.processGeneric = async (req, res) => {
  try {
    // Respond back with the received data (you could add other processing logic)
    const newData = new Generic({
      json_all: req.body,
    });

    // Save the user data to the database
    const saveData = await newData.save();

    res.json({ saveData });
  } catch (error) {
    console.error("Error processing ThingSpeak data:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
