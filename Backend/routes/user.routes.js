const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userCtrl = require("../controllers/user_controller");

router.post("/signup", auth, userCtrl.signup);
router.post("/login", auth, userCtrl.login);

module.exports = router;
