const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const { AUTHORIZATION_ERROR } = require("../utils/errors");

const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res.status(AUTHORIZATION_ERROR).send({ message: "Access denied" });
    return next(new UnauthorizedError("Access denied"));
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    // return res
    //   .status(AUTHORIZATION_ERROR)
    //   .send({ message: "Authorization needed to grant access!" });
    return next(new UnauthorizedError("Token needed to grant access!"));
  }
};

module.exports = auth;
