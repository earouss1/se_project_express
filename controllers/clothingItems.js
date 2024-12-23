const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  DEFAULT_ERROR,
  REQUEST_NOT_FOUND,
  BANNED_ERROR,
} = require("../utils/errors");

// GET /items — returns all clothing items

const getItems = (req, res) => {
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
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
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

  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = REQUEST_NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return res
          .status(REQUEST_NOT_FOUND)
          .send({ message: "Item is not found" });
      }
      if (item.owner.equals(req.user._id)) {
        return ClothingItem.findByIdAndDelete(itemId).then((dltItem) => {
          res.status(200).send({ data: dltItem });
        });
      }
      return res
        .status(BANNED_ERROR)
        .send({ message: "You do not have access to delete this item" });
    })
    .catch((error) => {
      console.error(error);
      if (error.statusCode === REQUEST_NOT_FOUND) {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
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
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = REQUEST_NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (error.statusCode === REQUEST_NOT_FOUND) {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
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
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = REQUEST_NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (error.statusCode === REQUEST_NOT_FOUND) {
        return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
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
  likeItem,
  dislikeItem,
};
