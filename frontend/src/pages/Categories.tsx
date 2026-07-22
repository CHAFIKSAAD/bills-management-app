import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
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
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setName("");
    setEditingCategoryId(null);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter category name");
      return;
    }

    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, { name });
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories", { name });
        toast.success("Category created successfully");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
  };

  const requestDeleteCategory = (id: number) => {
    setDeleteCategoryId(id);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;

    try {
      await api.delete(`/categories/${deleteCategoryId}`);
      toast.success("Category deleted successfully");
      setDeleteCategoryId(null);
      fetchCategories();
    } catch (error) {
      toast.error("Category delete failed");
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteCategoryId(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Categories Management</h3>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Organize products by categories.
        </p>
      </div>

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

      <div className="card">
        <h3>Search Categories</h3>

        <div className="form-grid grid-3">
          <input
            placeholder="Search by category name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className="secondary-button"
            onClick={() => setSearch("")}
          >
            Reset search
          </button>

          <div className="table-counter">
            {filteredCategories.length} categorie(s) found
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedCategories.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <div className="empty-state">No categories found</div>
              </td>
            </tr>
          ) : (
            paginatedCategories.map((category) => (
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
                      onClick={() => requestDeleteCategory(category.id)}
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

      {deleteCategoryId && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteCategory}
          onCancel={cancelDeleteCategory}
        />
      )}
    </div>
  );
}

export default Categories;
