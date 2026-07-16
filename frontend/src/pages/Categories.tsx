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

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  const resetForm = () => {
    setName("");
    setEditingCategoryId(null);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert("Please enter category name");
      return;
    }

    if (editingCategoryId) {
      await api.put(`/categories/${editingCategoryId}`, {
        name,
      });
    } else {
      await api.post("/categories", {
        name,
      });
    }

    resetForm();
    fetchCategories();
  };

  const editCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
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
      <h1 className="page-title">Categories</h1>

      <form onSubmit={saveCategory} className="card">
        <h3>{editingCategoryId ? "Update Category" : "Add Category"}</h3>

        <div className="form-grid grid-3">
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit" className="primary-button">
            {editingCategoryId ? "Update" : "Add"}
          </button>

          {editingCategoryId && (
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <div className="actions">
                  <button
                    className="secondary-button"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => deleteCategory(category.id)}
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

export default Categories;
