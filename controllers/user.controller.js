const bcrypt = require("bcryptjs");

const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields!",
    });
    return;
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });
    res.send({
      message: "User register successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error occurred a new user",
    });
  }
};
