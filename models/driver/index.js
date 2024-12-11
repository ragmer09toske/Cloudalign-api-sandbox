const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  number: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  district: { type: String, required: true },
  id_number: { type: String, required: true },
  license_id: { type: String, required: true },
  license_type: { type: String, required: true },
});

const Driver = mongoose.model("Driver", userSchema);

module.exports = Driver;
