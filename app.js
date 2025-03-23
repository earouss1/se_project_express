const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const { errors } = require("celebrate");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
// const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// require("dotenv").config();

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

// winston: request logger
app.use(requestLogger);

app.use("/", indexRouter);

// winston: error handler logger
app.use(errorLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// celebrate errors handler
app.use(errors());

// centralized middleware to handle errors
app.use(errorHandler);

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connect to the database");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`The port is ready for the server to run on ${PORT} `);
});
