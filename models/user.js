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
  email: {
    type: String,
    unique: true,
    require: [true, "An Email is required"],
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "An Email is required",
    },
  },
  password: {
    type: String,
    require: [true, "Oops, where is your password?"],
    select: false,
  },
});

userSchema.static.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email address or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Error("Incorrect email address or password")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
