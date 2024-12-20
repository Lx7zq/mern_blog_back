const PostModel = require("../models/Post");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.createPost = async (req, res) => {
  // file upload
  const { path } = req.file;
  const author = req.userId;
  const { title, summary, content } = req.body;

  // Validate input fields
  if (!title || !summary || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create post
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: path,
      author,
    });
    res.json(postDoc);
  } catch (error) {
    // Catch and return any errors that occur during post creation
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createAt: -1 })
    .limit(20);
  //SELECT * FROM , USER WHERE POST.author = USER._id
  res.json(posts);
};

exports.getPostsById = async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModel.findById(id).populate("author", ["username"]);
  res.json(postDoc);
};
