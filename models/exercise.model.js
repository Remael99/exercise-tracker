const mongoose = require("mongoose");
const User = require("./user.model");

const Schema = mongoose.Schema;

let exercise_schema = new Schema({
  date: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  description: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Exercise = mongoose.model("Exercise", exercise_schema);

module.exports = Exercise;
