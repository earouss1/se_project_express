const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { REQUEST_NOT_FOUND } = require("../utils/errors");
const { userLogin, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signin", userLogin);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(REQUEST_NOT_FOUND).send({ message: "The page is not found" });
});

module.exports = router;
