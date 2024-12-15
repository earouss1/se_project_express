const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    require: [true, "An avatar is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});
module.exports = mongoose.model("user", userSchema);
