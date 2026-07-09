const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice
} = require("../controllers/invoice.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoice);

module.exports = router;
