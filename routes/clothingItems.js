const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// GET /items — returns all clothing items
router.get("/", getItems);
// POST /items — creates a new item
router.post("/", createItem);
// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", deleteItem);
// Like /items/:itemId - likes an item by _id
router.put("/:itemId/likes", likeItem);
// dislikes /items/:itemId - dislikes an item by _id
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
