const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "",
  };
  next();
});

app.use("/", indexRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connect to the database");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`The port is ready for the server to run on ${PORT} `);
});
