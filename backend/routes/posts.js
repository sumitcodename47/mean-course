const router = require("express").Router();

const checkAuth = require("../middleware/check-auth");
const fileExtract = require("../middleware/file");

const postController = require("../controllers/post");

router.post("", checkAuth, fileExtract, postController.createPost);

router.get("/:id", postController.getPost);

router.put("/:id", checkAuth, fileExtract, postController.updatePost);

router.get("", postController.getAllPosts);

router.delete("/:id", checkAuth, postController.deletePosts);

module.exports = router;
