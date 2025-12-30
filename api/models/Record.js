const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  sunday_date: Date,
  service_type: String,
  service_number: String,
  l_offering: Number,
  t_offering: Number,
  oc_offering: String,
  total_offering: Number,
  min_tithe: Number,
  cong_tithe: Number,
  oc_tithe: String,
  total_tithe: Number,
  total_money: Number,
  men: Number,
  women: Number,
  children: Number,
  total: Number,
  first_timers: Number,
  new_convert: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
