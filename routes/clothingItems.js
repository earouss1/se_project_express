const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// GET /items — returns all clothing items
router.get("/", getItems);
// POST /items — creates a new item
router.post("/", createItem);
// DELETE /items/:itemId — deletes an item by _id
router.delete("/", deleteItem);
// PUT /items/:itemId - updates an item by _id
router.put("/", updateItem);
// Like /items/:itemId - likes an item by _id
router.put("/", likeItem);
// dislikes /items/:itemId - dislikes an item by _id
router.delete("/", dislikeItem);
module.exports = router;
