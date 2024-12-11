const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  number: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  district: { type: String, required: true },
  account_type: { type: String, required: true },
});

const Admin = mongoose.model("Admin", userSchema);

module.exports = Admin;
