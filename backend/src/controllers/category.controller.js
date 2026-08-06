const prisma = require("../config/prisma");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existingCategory = await prisma.category.findFirst({
  where: {
    name: {
      equals: name,
      mode: "insensitive",
    },
  },
});

if (existingCategory) {
  return res.status(400).json({
    message: "Cette catégorie existe déjà",
  });
}
    const category = await prisma.category.create({
      data: { name }
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const duplicateCategory = await prisma.category.findFirst({
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

if (duplicateCategory) {
  return res.status(400).json({
    message: "Une autre catégorie existe déjà avec ce nom",
  });
}
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name }
    });

    res.json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: Number(id) }
    });

    res.json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
