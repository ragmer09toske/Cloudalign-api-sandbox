// Controller function to process the ThingSpeak data
exports.processThingSpeakData = (req, res) => {
  try {
    const { channel, feeds } = req.body;

    // Validate the incoming data
    if (!channel || !feeds) {
      return res
        .status(400)
        .json({ message: "Invalid data received. Channel or feeds missing." });
    }

    // Log the received data (for debugging or processing)
    console.log("Received Channel Data:", channel);
    console.log("Received Feeds Data:", feeds);

    // Respond back with the received data (you could add other processing logic)
    return res.status(200).json({
      message: "Data received successfully",
      receivedData: { channel, feeds },
    });
  } catch (error) {
    console.error("Error processing ThingSpeak data:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.processGeneric = (req, res) => {
  try {
    // Log the received data (for debugging or processing)

    // Respond back with the received data (you could add other processing logic)
    return res.status(200).json({
      message: "Data received successfully",
    });
  } catch (error) {
    console.error("Error processing ThingSpeak data:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
