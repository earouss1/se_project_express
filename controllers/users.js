const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST_STATUS_CODE,
  DEFAULT_ERROR,
  REQUEST_NOT_FOUND,
  AUTHORIZATION_ERROR,
  CLASH_ERROR,
} = require("../utils/errors");

// GET Users
// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((error) => {
//       console.error(error);
//       return res.status(DEFAULT_ERROR).send({
//         message: "An error has occurred on the server",
//       });
//     });
// };

// Create users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "An Email address and Password are required" });
  }
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch((error) => {
      console.error("Error code:", error);
      if (error.code === 11000) {
        return res.status(CLASH_ERROR).send({
          message: "Choose a different email, this email is already existed",
        });
      }
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({
          message: error.message,
        });
      }
      return res.status(DEFAULT_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Get user by user/me
const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User is not found");
      error.statusCode = REQUEST_NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      console.error(error);
      if (error.statusCode === REQUEST_NOT_FOUND) {
        return res.status(REQUEST_NOT_FOUND).send({
          message: error.message,
        });
      }
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({
          message: error.message,
        });
      }
      return res.status(DEFAULT_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Update user: user/me
const updateUser = (req, res) => {
  const { userId } = req.user._id;
  const { name, avatar, email, password } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, email, avatar, password },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      const error = new Error("User is not found");
      error.statusCode = REQUEST_NOT_FOUND;
      throw error;
    })
    .then((user) => {
      const userMissingPassword = user.toObject();
      delete userMissingPassword.password;
      res.status(200).send(userMissingPassword);
    })
    .catch((error) => {
      if (error === "validatioError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: message.error });
      }
      if (error.statusCode === REQUEST_NOT_FOUND) {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      }
      return res.status(DEFAULT_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// User login
const userLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "An Email address and Password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).send({ token });
    })
    .catch((error) => {
      if (
        error.message.includes("Incorrect email") ||
        error.message.includes("Incorrect password")
      ) {
        return res
          .status(AUTHORIZATION_ERROR)
          .send({ message: "The password or email are invalid" });
      }
      return res.status(DEFAULT_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

module.exports = { createUser, getCurrentUser, updateUser, userLogin };
