const prisma = require("../config/prisma");

const round = (value) => {
  return Math.round(value * 100) / 100;
};

const createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, method = "CASH" } = req.body;

    if (!invoiceId || amount === undefined) {
      return res.status(400).json({
        message: "invoiceId and amount are required"
      });
    }

    const paymentAmount = Number(amount);

    if (paymentAmount <= 0) {
      return res.status(400).json({
        message: "Payment amount must be greater than 0"
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: {
          id: Number(invoiceId)
        },
        include: {
          payments: true
        }
      });

      if (!invoice) {
        const error = new Error("Invoice not found");
        error.status = 404;
        throw error;
      }

      const paidBefore = invoice.payments.reduce((sum, payment) => {
        return sum + payment.amount;
      }, 0);

      const remainingAmount = round(invoice.totalTTC - paidBefore);

      if (paymentAmount > remainingAmount) {
        const error = new Error("Payment amount exceeds remaining amount");
        error.status = 400;
        throw error;
      }

      const payment = await tx.payment.create({
        data: {
          invoiceId: Number(invoiceId),
          amount: paymentAmount,
          method
        }
      });

      const paidAfter = round(paidBefore + paymentAmount);

      let newStatus = "UNPAID";

      if (paidAfter >= invoice.totalTTC) {
        newStatus = "PAID";
      } else if (paidAfter > 0) {
        newStatus = "PARTIAL";
      }

      const updatedInvoice = await tx.invoice.update({
        where: {
          id: Number(invoiceId)
        },
        data: {
          status: newStatus
        },
        include: {
          client: true,
          items: {
            include: {
              product: true
            }
          },
          payments: true
        }
      });

      return {
        payment,
        invoice: updatedInvoice,
        paidBefore: round(paidBefore),
        paidAfter,
        remainingAmount: round(invoice.totalTTC - paidAfter)
      };
    });

    res.status(201).json({
      message: "Payment created successfully",
      ...result
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            client: true
          }
        }
      },
      orderBy: {
        paidAt: "desc"
      }
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getPaymentsByInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const payments = await prisma.payment.findMany({
      where: {
        invoiceId: Number(invoiceId)
      },
      orderBy: {
        paidAt: "desc"
      }
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentsByInvoice
};
