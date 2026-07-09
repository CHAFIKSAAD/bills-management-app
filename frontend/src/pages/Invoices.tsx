import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type InvoiceItemForm = {
  productId: number;
  productName: string;
  quantity: number;
};

type Invoice = {
  id: number;
  totalHT: number;
  tvaRate: number;
  tvaAmount: number;
  discount: number;
  totalTTC: number;
  status: string;
  client: Client;
};

function Invoices() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [tvaRate, setTvaRate] = useState("20");
  const [discount, setDiscount] = useState("0");

  const [items, setItems] = useState<InvoiceItemForm[]>([]);

  const fetchData = async () => {
    const clientsRes = await api.get("/clients");
    const productsRes = await api.get("/products");
    const invoicesRes = await api.get("/invoices");

    setClients(clientsRes.data);
    setProducts(productsRes.data);
    setInvoices(invoicesRes.data);
  };

  const exportInvoicesToExcel = () => {
  const data = invoices.map((invoice) => ({
    ID: invoice.id,
    Client: invoice.client?.name || "",
    "Total HT": invoice.totalHT,
    TVA: invoice.tvaAmount,
    Discount: invoice.discount,
    "Total TTC": invoice.totalTTC,
    Status: invoice.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

  XLSX.writeFile(workbook, "invoices.xlsx");
};

  const addItem = () => {
    if (!productId || !quantity) return;

    const product = products.find((p) => p.id === Number(productId));

    if (!product) return;

    setItems([
      ...items,
      {
        productId: product.id,
        productName: product.name,
        quantity: Number(quantity),
      },
    ]);

    setProductId("");
    setQuantity("1");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || items.length === 0) {
      alert("Select client and add at least one product");
      return;
    }

    await api.post("/invoices", {
      clientId: Number(clientId),
      tvaRate: Number(tvaRate),
      discount: Number(discount),
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    setClientId("");
    setProductId("");
    setQuantity("1");
    setTvaRate("20");
    setDiscount("0");
    setItems([]);

    fetchData();
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm("Delete this invoice?")) return;

    await api.delete(`/invoices/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Invoices</h1>

      <button
        onClick={exportInvoicesToExcel}
        style={{ marginBottom: "20px", padding: "8px 20px" }}
      >
        Export Excel
      </button>

      <form
        onSubmit={createInvoice}
        style={{
          background: "white",
          padding: "20px",
          marginBottom: "25px",
        }}
      >
        <h3>Create Invoice</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
          }}
        >
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price} DH - stock {product.stock}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            type="number"
            placeholder="TVA"
            value={tvaRate}
            onChange={(e) => setTvaRate(e.target.value)}
          />

          <input
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={addItem}
          style={{ marginTop: "15px", padding: "8px 20px" }}
        >
          Add Product
        </button>

        <div style={{ marginTop: "15px" }}>
          {items.map((item, index) => (
            <div key={index}>
              {item.productName} - quantity: {item.quantity}

              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{ marginLeft: "10px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          style={{ marginTop: "15px", padding: "8px 20px" }}
        >
          Create Invoice
        </button>
      </form>

      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Client</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total HT</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>TVA</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Discount</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total TTC</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.id}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.client?.name}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.totalHT} DH
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.tvaAmount} DH
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.discount} DH
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.totalTTC} DH
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {invoice.status}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                <Link to={`/invoices/${invoice.id}`}>View</Link>

                <button
                  onClick={() => deleteInvoice(invoice.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Invoices;