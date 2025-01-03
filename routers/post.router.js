const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { upload, uploadToFirebase } = require("../middlewares/file.middleware");
const authJwt = require("../middlewares/authJwt.middleware");

//http://localhost:5000/api/v1/post
router.post(
  "",
  authJwt.verifyToken,
  upload,
  uploadToFirebase,
  postController.createPost
);
//http://localhost:5000/api/v1/post
router.get("", postController.getPosts);
//http://localhost:5000/api/v1/post/id
router.get("/:id", postController.getPostsById);
//http://localhost:5000/api/v1/post/id
router.delete("/:id", authJwt.verifyToken, postController.deletePost);
//http://localhost:5000/api/v1/post/id
router.put("/:id", authJwt.verifyToken, upload, postController.updatePost);
module.exports = router;
