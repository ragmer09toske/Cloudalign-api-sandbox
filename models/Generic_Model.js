const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  json_all: {
    type: mongoose.Schema.Types.Mixed, // Accepts any data type (e.g., object, array, string, etc.)
    required: true,
  },
});

const Generic = mongoose.model("Json_Generic", userSchema);

module.exports = Generic;
