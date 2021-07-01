const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  emmiter: { type: Schema.ObjectId, ref: "User", required: true }, // el que envia el mensaje
  receiver: { type: Schema.ObjectId, ref: "User", required: true }, // el que recibe el mensaje
  text: { type: String, required: true },
  create_at: { type: String, required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
