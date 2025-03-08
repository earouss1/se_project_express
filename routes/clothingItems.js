const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateId,
  validateClothingItem,
} = require("../middlewares/validation");

// GET /items — returns all clothing items
router.get("/", getItems);
// POST /items — creates a new item
router.post("/", auth, validateClothingItem, createItem);
// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", auth, validateId, deleteItem);
// Like /items/:itemId - likes an item by _id
router.put("/:itemId/likes", auth, validateId, likeItem);
// dislikes /items/:itemId - dislikes an item by _id
router.delete("/:itemId/likes", auth, validateId, dislikeItem);
module.exports = router;
