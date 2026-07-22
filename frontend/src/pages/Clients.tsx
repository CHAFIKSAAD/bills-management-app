import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

function Clients() {
  const [clients, setClients] = useState<Client[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      toast.error("Failed to load clients");
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const keyword = search.toLowerCase();

      return (
        client.name.toLowerCase().includes(keyword) ||
        client.email.toLowerCase().includes(keyword) ||
        client.phone.toLowerCase().includes(keyword) ||
        client.address.toLowerCase().includes(keyword)
      );
    });
  }, [clients, search]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setEditingClientId(null);
  };

  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !address) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editingClientId) {
        await api.put(`/clients/${editingClientId}`, {
          name,
          email,
          phone,
          address,
        });

        toast.success("Client updated successfully");
      } else {
        await api.post("/clients", {
          name,
          email,
          phone,
          address,
        });

        toast.success("Client created successfully");
      }

      resetForm();
      fetchClients();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const editClient = (client: Client) => {
    setEditingClientId(client.id);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
  };

  const requestDeleteClient = (id: number) => {
    setDeleteClientId(id);
  };

  const confirmDeleteClient = async () => {
    if (!deleteClientId) return;

    try {
      await api.delete(`/clients/${deleteClientId}`);
      toast.success("Client deleted successfully");
      setDeleteClientId(null);
      fetchClients();
    } catch (error) {
      toast.error("Client delete failed");
    }
  };

  const cancelDeleteClient = () => {
    setDeleteClientId(null);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Clients Management</h3>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Manage customer information and contact details.
        </p>
      </div>

      <form onSubmit={saveClient} className="card">
        <h3>{editingClientId ? "Update Client" : "Add Client"}</h3>

        <div className="form-grid grid-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button type="submit" className="primary-button">
            {editingClientId ? "Update" : "Add"}
          </button>

          {editingClientId && (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <h3>Search Clients</h3>

        <div className="form-grid grid-3">
          <input
            placeholder="Search by name, email, phone or address..."
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
            {filteredClients.length} client(s) found
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedClients.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className="empty-state">No clients found</div>
              </td>
            </tr>
          ) : (
            paginatedClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>
                  <div className="actions">
                    <button
                      className="secondary-button"
                      onClick={() => editClient(client)}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => requestDeleteClient(client.id)}
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

      {deleteClientId && (
        <ConfirmModal
          title="Delete Client"
          message="Are you sure you want to delete this client? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteClient}
          onCancel={cancelDeleteClient}
        />
      )}
    </div>
  );
}

export default Clients;
