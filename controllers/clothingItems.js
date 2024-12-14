const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  DEFAULT_ERROR,
  REQUEST_NOT_FOUND,
} = require("../utils/errors");

// GET /items — returns all clothing items

const getItems = (req, res) => {
  console.log(req);
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((error) => {
      console.error(error);
      return res.status(DEFAULT_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

// POST /items — creates a new item

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({
          message: error.message,
        });
      }
      return res.status(DEFAULT_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

// DELETE /items/:itemId — deletes an item by _id

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      console.log(item);
      res.status(200).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (err.name === "DocumentNotFoundError") {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      } else if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: error.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// PUT /items/:itemId — updates an item by _id

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  console.log(itemId, imageUrl);

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (err.name === "DocumentNotFoundError") {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      } else if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: error.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Like /items/:itemId - likes an item by _id

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((item) => {
      console.log(item);
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (err.name === "DocumentNotFoundError") {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      } else if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: error.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// dislikes /items/:itemId - dislikes an item by _id

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((item) => {
      console.log(item);
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (err.name === "DocumentNotFoundError") {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      } else if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: error.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
};
