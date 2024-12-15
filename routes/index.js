const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { REQUEST_NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(REQUEST_NOT_FOUND).send({ message: "The page is not found" });
});

module.exports = router;
