const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user_schema = new Schema({
  username: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", user_schema);

module.exports = User;
