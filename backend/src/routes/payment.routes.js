const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createPayment,
  getPayments,
  getPaymentsByInvoice
} = require("../controllers/payment.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/invoice/:invoiceId", getPaymentsByInvoice);

module.exports = router;
