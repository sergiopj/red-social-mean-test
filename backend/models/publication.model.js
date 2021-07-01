const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  file: { type: String, required: true },
  create_at: { type: String, required: true },
});

module.exports = mongoose.model("Publication", PublicationSchema);
