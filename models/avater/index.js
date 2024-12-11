const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  url: { type: String, required: true },
  user_id: { type: String, required: true },
});

const Avatar = mongoose.model("Avatar", userSchema);

module.exports = Avatar;
