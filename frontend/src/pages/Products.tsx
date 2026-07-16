import { useEffect, useState } from "react";
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

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !stock || !categoryId) {
      alert("Please fill name, price, stock and category");
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
    } else {
      await api.post("/products", productData);
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

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div>
      <h1 className="page-title">Products</h1>

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

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price} DH</td>
              <td>{product.stock}</td>
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
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
