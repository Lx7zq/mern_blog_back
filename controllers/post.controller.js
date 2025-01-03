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
      cover: req.file.firebaseUrl,
      author,
    });
    if (!postDoc) {
      res.status(404).send({
        message: "Can't create post",
      });
      return;
    }
    res.json(postDoc);
  } catch (error) {
    // Catch and return any errors that occur during post creation
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const postDoc = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createAt: -1 })
      .limit(20);
    //SELECT * FROM , USER WHERE POST.author = USER._id
    if (!postDoc) {
      res.status(404).send({
        message: "Can't get posts",
      });
      return;
    }
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something error occurred while getting Post",
    });
  }
};

exports.getPostsById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id).populate("author", [
      "username",
    ]);
    if (!postDoc) {
      res.status(404).send({
        message: "Post not found!",
      });
      return;
    }
    res.json(postDoc);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message:
        error.message || "Something error occurred while getting Post Details",
    });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.userId;
  try {
    const postDoc = await PostModel.findById(id);
    if (authorId === postDoc.author.toString()) {
      res.status(403).send({
        message: "You can't delete this post",
      });
      return;
    }
    await postDoc.deleteOne();
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while deleting a post",
    });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: "Post id is not provided" });
  const authorId = req.userId;
  try {
    const postDoc = await PostModel.findById(id);
    if (authorId === postDoc.author.toString()) {
      res.status(403).send({
        message: "You can't update this post",
      });
      return;
    }
    const { title, summary, content } = req.body;
    if (!title || !summary || !content) {
      return res.status(404).json({ message: "All fields is required" });
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (req.file) {
      postDoc.cover = req.file.firebaseUrl;
    }
    await postDoc.save();
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating a post",
    });
  }
};
