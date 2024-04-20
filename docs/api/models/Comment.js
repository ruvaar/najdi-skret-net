const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  toilet_id: { type: String, required: true },
  username: { type: String, required: true },
  comment: { type: String },
  createdOn: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
});

const CommentModel = mongoose.model("comments", CommentSchema);
module.exports = CommentModel;
