import { useEffect, useState } from "react";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
};

function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchClients = async () => {
    const response = await api.get("/clients");
    setClients(response.data);
  };

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/clients", {
      name,
      email,
      phone,
      address,
    });

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");

    fetchClients();
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
      <h1>Clients</h1>

      <form onSubmit={addClient} style={{ background: "white", padding: "20px", marginBottom: "25px" }}>
        <h3>Add Client</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Address</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{client.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{client.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{client.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{client.phone}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{client.address}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <button onClick={() => deleteClient(client.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clients;
