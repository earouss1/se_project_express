const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
// const { REQUEST_NOT_FOUND } = require("../utils/errors");
const { userLogin, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");
const {
  validateAuthenticatingUser,
  validateCreatingUser,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signin", validateAuthenticatingUser, userLogin);
router.post("/signup", validateCreatingUser, createUser);

router.use((req, res, next) => {
  // res.status(REQUEST_NOT_FOUND).send({ message: "The page is not found" });
  next(new NotFoundError("The page is not found"));
});

module.exports = router;
