const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  DEFAULT_ERROR,
  REQUEST_NOT_FOUND,
} = require("../utils/errors");

// GET Users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      console.error(error);
      return res.status(DEFAULT_ERROR).send({
        message: error.message,
      });
    });
};

// Create users

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      console.error(error);
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

// Get user by Id

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = REQUEST_NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
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

module.exports = { getUsers, createUser, getUser };
