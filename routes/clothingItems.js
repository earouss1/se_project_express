const router = require("express").Router();
const auth = require("../middlewares/auth");
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
router.post("/", auth, createItem);
// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", auth, deleteItem);
// Like /items/:itemId - likes an item by _id
router.put("/:itemId/likes", auth, likeItem);
// dislikes /items/:itemId - dislikes an item by _id
router.delete("/:itemId/likes", auth, dislikeItem);
module.exports = router;
