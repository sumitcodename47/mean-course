const router = require("express").Router();
const userController = require("../controllers/user");

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin);

module.exports = router;
