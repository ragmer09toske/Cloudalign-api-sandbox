const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  json_all: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: String, // Store as a formatted string (if needed in local time)
    default: () => moment().tz("Africa/Maseru").format("YYYY-MM-DDTHH:mm:ssZ"), // Store with Maseru time offset
  },
});

const Generic = mongoose.model("Json_Generic", userSchema);

module.exports = Generic;
