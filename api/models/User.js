const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  username: String,
  password: String,

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", RecordSchema);
