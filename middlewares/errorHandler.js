function errorHandler(error, req, res, next) {
  console.error(error);
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occured on the server" : message,
  });
}

module.exports = errorHandler;
