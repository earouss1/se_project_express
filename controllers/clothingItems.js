const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   DEFAULT_ERROR,
//   REQUEST_NOT_FOUND,
//   BANNED_ERROR,
// } = require("../utils/errors");

// GET /items — returns all clothing items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(next);
  // .catch((error) => {
  //   console.error(error);
  //   return res.status(DEFAULT_ERROR).send({
  //     message: "An error has occurred on the server.",
  //   });
  // });
};

// POST /items — creates a new item

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return next(new BadRequestError("You have entered invalid data"));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("You have entered invalid data"));
      }
      return next(error);
    });
};

// DELETE /items/:itemId — deletes an item by _id

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item is not found"));
        // return res
        //   .status(REQUEST_NOT_FOUND)
        //   .send({ message: "Item is not found" });
      }
      if (item.owner.equals(req.user._id)) {
        return ClothingItem.findByIdAndDelete(itemId).then((dltItem) => {
          res.status(200).send({ data: dltItem });
        });
      }
      return next(
        new ForbiddenError("You do not have access to delete this item")
      );
      // return res
      //   .status(BANNED_ERROR)
      //   .send({ message: "You do not have access to delete this item" });
    })
    .catch((error) => {
      console.error(error);
      if (error.statusCode === NotFoundError) {
        // return res.status(REQUEST_NOT_FOUND).send({ message: error.message });
        return next(new NotFoundError("Item is not found"));
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        return next(new BadRequestError("You have entered invalid data"));
      }
      return next(error);
    });
};

// Like /items/:itemId - likes an item by _id

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (error.statusCode === NotFoundError) {
        return next(new NotFoundError("Item ID not found"));
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        return next(new BadRequestError("You have entered invalid data"));
      }
      return next(error);
    });
};

// dislikes /items/:itemId - dislikes an item by _id

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID is not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (error.statusCode === NotFoundError) {
        return next(new NotFoundError("Item ID is not found"));
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        return next(new BadRequestError("Item ID is not found"));
      }
      return next(error);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
