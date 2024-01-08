const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");

// import routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

// connect to database

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB Connected...");
  })
  .catch((err) => console.log("database error : ", err));

// app middleware
app.use(morgan("dev"));
// app.use(cors()); use this when we are in the production mode
app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
app.use(cors({ origin: "http://localhost:5173" }));
}

// use middleware
app.use("/api", authRouter);
app.use("/api", userRouter);

// running the server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running on port ${port} - ${process.env.NODE_ENV}`);
});
