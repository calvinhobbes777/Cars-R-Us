const createPost = require("./createPost");
const deletePost = require("./deletePost");
const updatePost = require("./updatePost");

const post = {
  createPost,
  updatePost,
  deletePost
};

module.exports = { post };
