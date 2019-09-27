const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded =jwt.verify(token, "secret_this_should_be_longer");
    req.userdata = {email:decoded.email,userId:decoded.userId};
    next();
  } catch (error) {
    res.status(401).json({ message: "U R not authenticated" });
  }
};
