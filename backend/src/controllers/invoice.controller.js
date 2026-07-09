const prisma = require("../config/prisma");

const round = (value) => {
  return Math.round(value * 100) / 100;
};

const createInvoice = async (req, res) => {
  try {
    const { clientId, items, tvaRate = 20, discount = 0 } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const invoice = await prisma.$transaction(async (tx) => {
      const client = await tx.client.findUnique({
        where: { id: Number(clientId) }
      });

      if (!client) {
        const error = new Error("Client not found");
        error.status = 404;
        throw error;
      }

      let totalHT = 0;
      const invoiceItems = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: Number(item.productId) }
        });

        if (!product) {
          const error = new Error("Product not found: " + item.productId);
          error.status = 404;
          throw error;
        }

        const quantity = Number(item.quantity);

        if (quantity <= 0) {
          const error = new Error("Quantity must be greater than 0");
          error.status = 400;
          throw error;
        }

        if (product.stock < quantity) {
          const error = new Error("Stock insufficient for product: " + product.name);
          error.status = 400;
          throw error;
        }

        const unitPrice = product.price;
        const itemTotal = round(unitPrice * quantity);

        totalHT += itemTotal;

        invoiceItems.push({
          productId: product.id,
          quantity,
          unitPrice,
          total: itemTotal
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - quantity
          }
        });
      }

      totalHT = round(totalHT);
      const finalTvaRate = Number(tvaRate);
      const finalDiscount = Number(discount);

      const tvaAmount = round(totalHT * finalTvaRate / 100);
      const totalTTC = round(totalHT + tvaAmount - finalDiscount);

      if (totalTTC < 0) {
        const error = new Error("Total TTC cannot be negative");
        error.status = 400;
        throw error;
      }

      const createdInvoice = await tx.invoice.create({
        data: {
          clientId: Number(clientId),
          totalHT,
          tvaRate: finalTvaRate,
          tvaAmount,
          discount: finalDiscount,
          totalTTC,
          status: "UNPAID",
          items: {
            create: invoiceItems
          }
        },
        include: {
          client: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return createdInvoice;
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: Number(id) },
        include: {
          items: true
        }
      });

      if (!invoice) {
        const error = new Error("Invoice not found");
        error.status = 404;
        throw error;
      }

      for (const item of invoice.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      await tx.invoice.delete({
        where: { id: Number(id) }
      });
    });

    res.json({
      message: "Invoice deleted successfully"
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice
};
