const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

// Get user
router.get("/", getUsers);
// Get user by Id
router.get("/:userId", getUser);
// Create user
router.post("/", createUser);

module.exports = router;
