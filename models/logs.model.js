const mongoose = require("mongoose");
const Exercise = require("./exercise.model");
const User = require("./user.model");

const Schema = mongoose.Schema;

let log_schema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: User.username,
    required: true,
  },
  count: {
    type: Number,
  },
  log: [Exercise],
  date: {
    type: Date,
  },
});

const Log = mongoose.model("Log", log_schema);

module.exports = Log;
