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

  const fetchProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/products", {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: categoryId ? Number(categoryId) : null,
    });

    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");

    fetchProducts();
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
      <h1>Products</h1>

      <form onSubmit={addProduct} style={{ background: "white", padding: "20px", marginBottom: "25px" }}>
        <h3>Add Product</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
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

        <button type="submit" style={{ marginTop: "15px", padding: "8px 20px" }}>
          Add
        </button>
      </form>

      <table style={{ width: "100%", background: "white", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Description</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Price</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Stock</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Category</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.description}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.price} DH</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.stock}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{product.category?.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
