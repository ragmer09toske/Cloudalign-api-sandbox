const mongoose = require("mongoose");
const moment = require("moment-timezone"); // To handle timezone conversion

const userSchema = new mongoose.Schema({
  json_all: {
    type: mongoose.Schema.Types.Mixed, // Accepts any data type (e.g., object, array, string, etc.)
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => moment().tz("Africa/Maseru").toDate(), // Automatically set to current time in Maseru timezone
  },
});

// Optional: Add a pre-save hook if further customization is needed
userSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = moment().tz("Africa/Maseru").toDate();
  }
  next();
});

const Generic = mongoose.model("Json_Generic", userSchema);

module.exports = Generic;
