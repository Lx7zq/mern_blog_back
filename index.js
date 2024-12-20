const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");

const app = express();
const BASE_URL = process.env.BASE_URL; //กำหนด base_url frontend ดึงมาจาก env
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Coneect to mongoose
try {
  mongoose.connect(DB_URL);
  console.log("Connect to mongodb successfully");
} catch (error) {
  console.log("DB connection fail");
}

app.use(cors({ origin: BASE_URL, credentials: true })); //origin กำหนดลิ้งที่เชื่อมไป front

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome blog NPRU blog restful API</h1>");
});

app.use("/uploads", express.static(__dirname + "/uploads"));

//use router
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/post", postRouter);

app.listen(PORT, () => {
  console.log("Server is runing on http:localhost:" + PORT);
});
