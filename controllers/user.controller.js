const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();

const secret = process.env.SECRET;
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

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({
      message: "Please provide all required fields!",
    });
  }

  try {
    // Find the user in the database
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Compare passwords (bcrypt.compare is asynchronous)
    const isPasswordMatched = bcrypt.compare(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).send({
        message: "Invalid credentials",
      });
    }

    // Generate the JWT token
    const token = jwt.sign({ username, id: userDoc._id }, secret, {
      expiresIn: "1h",
    });

    // Send success response with token
    return res.send({
      message: "User logged in successfully",
      id: userDoc._id,
      username,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || "Something error occurred while logging in user",
    });
  }
};
