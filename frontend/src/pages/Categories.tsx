import { useEffect, useState } from "react";
import api from "../services/api";

type Category = {
  id: number;
  name: string;
  createdAt: string;
};

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/categories", {
      name,
    });

    setName("");
    fetchCategories();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;

    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>

      <form onSubmit={addCategory} style={{ background: "white", padding: "20px", marginBottom: "25px" }}>
        <h3>Add Category</h3>

        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />

        <button type="submit" style={{ marginLeft: "10px", padding: "8px 20px" }}>
          Add
        </button>
      </form>

      <table style={{ width: "100%", background: "white", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{category.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{category.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
