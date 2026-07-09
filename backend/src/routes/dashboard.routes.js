const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  getDashboardStats
} = require("../controllers/dashboard.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDashboardStats);

module.exports = router;
