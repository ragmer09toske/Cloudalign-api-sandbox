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

exports.getAllGenericData = async (req, res) => {
  try {
    // Retrieve all documents from the Generic collection
    const allData = await Generic.find({});

    // If no data found, return appropriate message
    if (!allData || allData.length === 0) {
      return res.status(404).json({ message: "No generic data found" });
    }

    // Return the data
    res.status(200).json({
      count: allData.length,
      data: allData,
    });
  } catch (error) {
    console.error("Error fetching generic data:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
