const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlenght: 2,
    maxlenght: 30,
  },
  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    require: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    require: [true, "This is required"],
  },
  likes: {},
  createAt: {},
});
module.exports = mongoose.model(item, clothingItemSchema);
