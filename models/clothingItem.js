const mongoose = require("mongoose");
const validator = require("validator");
const user = require("./user");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    require: [true, "You must choose your weather"],
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    require: [true, "An url is needed"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    require: [true, "This is required"],
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("clothingItems", clothingItemSchema);
