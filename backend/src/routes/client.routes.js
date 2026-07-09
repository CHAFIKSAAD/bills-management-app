const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require("../controllers/client.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
