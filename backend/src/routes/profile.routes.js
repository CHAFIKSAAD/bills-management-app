const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profile.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

module.exports = router;
