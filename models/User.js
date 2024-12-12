const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  //new สร้าง object จาก class
  username: {
    type: String,
    require: true,
    unique: true,
    min: 4,
  },
  password: {
    type: String,
    require: true,
  },
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;
