const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  surname: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nick: { type: Array, required: true, unique: true },
  role: { type: Array, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
