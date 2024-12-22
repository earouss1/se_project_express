const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Get user
// router.get("/", getUsers);
// Get user by Id
router.get("/me", auth, getCurrentUser);
// Create user
// router.post("/", createUser);
// Upadte user
router.patch("/me", auth, updateUser);

module.exports = router;
