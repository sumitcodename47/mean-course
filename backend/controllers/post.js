const Post = require("../models/posts");

exports.createPost = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post Created successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Creating a post failed.",
      });
    });
};

exports.getPost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(400).json({ message: "Post not found." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Fetching post failed." });
    });
};

exports.updatePost = (req, res) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.body.id, creator: req.userData.userId }, post)
    .then((resulst) => {
      if (resulst.matchedCount > 0) {
        res.status(200).json({ message: "Post Updated successful." });
      } else {
        res.status(401).json({ message: "Not Authorised." });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't update Post.",
      });
    });
};

exports.getAllPosts = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documnets) => {
      fetchedPosts = documnets;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetched successfully.",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Fetching posts failed." });
    });
};

exports.deletePosts = (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted." });
      } else {
        res.status(401).json({ message: "Not Authorised." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Fetching posts failed." });
    });
};
