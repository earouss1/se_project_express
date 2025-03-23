const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   DEFAULT_ERROR,
//   REQUEST_NOT_FOUND,
//   AUTHORIZATION_ERROR,
//   CLASH_ERROR,
// } = require("../utils/errors");

// Create users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("An email and a password are required"));
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
        return next(
          new ConflictError(
            "Choose a different email, this email is already existed"
          )
        );
        // return res.status(CLASH_ERROR).send({
        //   message: "Choose a different email, this email is already existed",
        // });
      }
      if (error.name === "ValidationError") {
        return next(
          new BadRequestError(
            "Choose a different email, this email is already existed"
          )
        );
      }
      return next(error);
    });
};

// Get user by user/me
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User is not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      console.error(error);
      if (error.statusCode === NotFoundError) {
        return next(new NotFoundError("User does not exist"));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("User does not exist"));
      }
      return next(error);
    });
};

// Update user: user/me
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      const error = new Error("User is not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((user) => {
      const userMissingPassword = user.toObject();
      delete userMissingPassword.password;
      res.status(200).send(userMissingPassword);
    })
    .catch((error) => {
      if (error === "ValidationError") {
        return next(
          new BadRequestError("User is not found. Check and try again")
        );
      }
      if (error.statusCode === NotFoundError) {
        return next(new NotFoundError("User is not found"));
      }
      return next(error);
    });
};

// User login
const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("An Email address and Password are required")
    );
    // return res
    //   .status(BAD_REQUEST_STATUS_CODE)
    //   .send({ message: "An Email address and Password are required" });
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
        return next(new UnauthorizedError("The password or email are invalid"));
        // return res
        //   .status(AUTHORIZATION_ERROR)
        //   .send({ message: "The password or email are invalid" });
      }
      return next(error);
    });
};

module.exports = { createUser, getCurrentUser, updateUser, userLogin };
