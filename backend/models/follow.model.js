const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true }, // user al que corresponde el follow
  followed: { type: Schema.ObjectId, ref: "User", required: true }, // user al que sigue
});

module.exports = mongoose.model("Follow", FollowSchema);
