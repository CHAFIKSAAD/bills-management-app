const prisma = require("../config/prisma");

const getDashboardStats = async (req, res) => {
  try {
    const clientsCount = await prisma.client.count();
    const productsCount = await prisma.product.count();
    const invoicesCount = await prisma.invoice.count();

    const unpaidInvoicesCount = await prisma.invoice.count({
      where: {
        status: "UNPAID"
      }
    });

    const partialInvoicesCount = await prisma.invoice.count({
      where: {
        status: "PARTIAL"
      }
    });

    const paidInvoicesCount = await prisma.invoice.count({
      where: {
        status: "PAID"
      }
    });

    const paidInvoices = await prisma.invoice.findMany({
      where: {
        status: "PAID"
      }
    });

    const totalRevenue = paidInvoices.reduce((sum, invoice) => {
      return sum + invoice.totalTTC;
    }, 0);

    const totalStock = await prisma.product.aggregate({
      _sum: {
        stock: true
      }
    });

    const recentInvoices = await prisma.invoice.findMany({
      take: 5,
      include: {
        client: true,
        payments: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      clientsCount,
      productsCount,
      invoicesCount,
      paidInvoicesCount,
      partialInvoicesCount,
      unpaidInvoicesCount,
      totalRevenue,
      totalStock: totalStock._sum.stock || 0,
      recentInvoices
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
