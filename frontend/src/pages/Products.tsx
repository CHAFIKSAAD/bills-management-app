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
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category;
};

type CompanySettings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  defaultTva: string;
  currency: string;
};
const defaultCompanySettings: CompanySettings = {
  companyName: "MASSMEDIA",
  tagline: "Impacting business",
  email: "contact@massmedia.ma",
  phone: "+212 6 00 00 00 00",
  address: "Casablanca, Maroc",
  city: "Casablanca",
  defaultTva: "20",
  currency: "DH",
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
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(
  defaultCompanySettings
  );
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setEditingProductId(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.category?.name?.toLowerCase().includes(keyword);

      const matchStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && product.stock > 5) ||
        (stockFilter === "LOW_STOCK" && product.stock > 0 && product.stock <= 5) ||
        (stockFilter === "OUT_OF_STOCK" && product.stock === 0);

      return matchSearch && matchStock;
    });
  }, [products, search, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || stock === "" || !categoryId) {
      toast.error("Please fill name, price, stock and category");
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId),
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, productData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", productData);
        toast.success("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
  const message =
    error.response?.data?.message || "Opération échouée";

  toast.error(message);
}
  };

  const editProduct = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setCategoryId(String(product.categoryId));
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

  const getStockBadge = (product: Product) => {
    if (product.stock === 0) {
      return <span className="badge badge-unpaid">OUT OF STOCK</span>;
    }

    if (product.stock <= 5) {
      return <span className="badge badge-partial">LOW STOCK</span>;
    }

    return <span className="badge badge-paid">IN STOCK</span>;
  };

  useEffect(() => {
  const savedSettings = localStorage.getItem("companySettings");

  if (savedSettings) {
    setCompanySettings(JSON.parse(savedSettings));
  }

  fetchProducts();
  fetchCategories();
}, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter]);

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Products Management</h3>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Manage products, stock levels, categories and prices.
        </p>
      </div>

      <form onSubmit={saveProduct} className="card">
        <h3>{editingProductId ? "Update Product" : "Add Product"}</h3>

        <div className="form-grid grid-5">
          <input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
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
        <h3>Search Products</h3>

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

        <div className="table-counter" style={{ marginTop: "12px" }}>
          {filteredProducts.length} product(s) found
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <div className="empty-state">No products found</div>
              </td>
            </tr>
          ) : (
            paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category?.name}</td>
                <td>
  {product.price} {companySettings.currency}
</td>
                <td>{product.stock}</td>
                <td>{getStockBadge(product)}</td>
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="secondary-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <button
            className="secondary-button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

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
