import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  category?: Category;
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const fetchProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setEditingProductId(null);
  };

  const getStockBadgeClass = (stock: number) => {
    if (stock === 0) return "badge badge-unpaid";
    if (stock <= 5) return "badge badge-partial";
    return "badge badge-paid";
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "OUT OF STOCK";
    if (stock <= 5) return "LOW STOCK";
    return "IN STOCK";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryName = product.category?.name || "";

      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        categoryName.toLowerCase().includes(search.toLowerCase());

      const matchStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && product.stock > 5) ||
        (stockFilter === "LOW_STOCK" && product.stock > 0 && product.stock <= 5) ||
        (stockFilter === "OUT_OF_STOCK" && product.stock === 0);

      return matchSearch && matchStock;
    });
  }, [products, search, stockFilter]);

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !stock || !categoryId) {
      toast.error("Please fill name, price, stock and category");
      return;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId),
    };

    if (editingProductId) {
  await api.put(`/products/${editingProductId}`, productData);
  toast.success("Product updated successfully");
} else {
  await api.post("/products", productData);
  toast.success("Product created successfully");
}

resetForm();
fetchProducts();
  };

  const editProduct = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setCategoryId(String(product.categoryId || product.category?.id || ""));
  };

 const requestDeleteProduct = (id: number) => {
  setDeleteProductId(id);
};

const confirmDeleteProduct = async () => {
  if (!deleteProductId) return;

  try {
    await api.delete(`/products/${deleteProductId}`);
    toast.success("Product deleted successfully");
    setDeleteProductId(null);
    fetchProducts();
  } catch (error) {
    toast.error("Product delete failed");
  }
};

const cancelDeleteProduct = () => {
  setDeleteProductId(null);
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Products Management</h3>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Manage products, categories, prices and stock levels.
        </p>
      </div>

      <form onSubmit={saveProduct} className="card">
        <h3>{editingProductId ? "Update Product" : "Add Product"}</h3>

        <div className="form-grid grid-5">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button type="submit" className="primary-button">
            {editingProductId ? "Update" : "Add"}
          </button>

          {editingProductId && (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <h3>Filter Products</h3>

        <div className="form-grid grid-3">
          <input
            placeholder="Search by name, description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="ALL">All stock</option>
            <option value="IN_STOCK">In stock</option>
            <option value="LOW_STOCK">Low stock</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
          </select>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStockFilter("ALL");
            }}
          >
            Reset filters
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Stock Status</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <div className="empty-state">No products found</div>
              </td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} DH</td>
                <td>{product.stock}</td>
                <td>
                  <span className={getStockBadgeClass(product.stock)}>
                    {getStockLabel(product.stock)}
                  </span>
                </td>
                <td>{product.category?.name}</td>
                <td>
                  <div className="actions">
                    <button
                      className="secondary-button"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => requestDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
     {deleteProductId && (
  <ConfirmModal
    title="Delete Product"
    message="Are you sure you want to delete this product? This action cannot be undone."
    confirmText="Delete"
    cancelText="Cancel"
    onConfirm={confirmDeleteProduct}
    onCancel={cancelDeleteProduct}
  />
)} 
    </div>
  );
}

export default Products;
