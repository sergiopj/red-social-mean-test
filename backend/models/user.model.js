const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  surname: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nick: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  image: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);
