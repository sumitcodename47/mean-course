const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    jwt.verify(token, "this_should_be_longer_text");
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Auth Failed." });
  }
};
