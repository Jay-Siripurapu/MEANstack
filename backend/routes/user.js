const express = require("express");
const usercontroller = require("../controllers/user");

const router = express.Router();

router.post("/signup",usercontroller.createUser );

router.post("/login", usercontroller.userLogin);

module.exports = router;
