import { useEffect, useState } from "react";
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

  const fetchClients = async () => {
    const response = await api.get("/clients");
    setClients(response.data);
  };

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
      alert("Please fill all fields");
      return;
    }

    if (editingClientId) {
      await api.put(`/clients/${editingClientId}`, {
        name,
        email,
        phone,
        address,
      });
    } else {
      await api.post("/clients", {
        name,
        email,
        phone,
        address,
      });
    }

    resetForm();
    fetchClients();
  };

  const editClient = (client: Client) => {
    setEditingClientId(client.id);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
  };

  const deleteClient = async (id: number) => {
    if (!confirm("Delete this client?")) return;

    await api.delete(`/clients/${id}`);
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div>
      <h1 className="page-title">Clients</h1>

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
          {clients.map((client) => (
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
                    onClick={() => deleteClient(client.id)}
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

export default Clients;
