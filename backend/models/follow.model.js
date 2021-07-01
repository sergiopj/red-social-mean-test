const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true }, // los que te siguen
  followed: { type: Schema.ObjectId, ref: "User", required: true }, // a los que sigues
});

module.exports = mongoose.model("Follow", FollowSchema);
