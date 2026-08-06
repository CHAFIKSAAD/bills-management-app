const prisma = require("../config/prisma");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const existingProduct = await prisma.product.findFirst({
  where: {
    name: {
      equals: name,
      mode: "insensitive",
    },
  },
});

if (existingProduct) {
  return res.status(400).json({
    message: "Ce produit existe déjà",
  });
}
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: stock ? Number(stock) : 0,
        categoryId: categoryId ? Number(categoryId) : null
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } }
            ]
          }
        : {},
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;
    const duplicateProduct = await prisma.product.findFirst({
  where: {
    id: {
      not: Number(id),
    },
    name: {
      equals: name,
      mode: "insensitive",
    },
  },
});

if (duplicateProduct) {
  return res.status(400).json({
    message: "Un autre produit existe déjà avec ce nom",
  });
}
    const product = await prisma.product.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined
      },
      include: {
        category: true
      }
    });

    res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
