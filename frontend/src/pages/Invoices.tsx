import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
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

type Payment = {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  paidAt: string;
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentPaidAmount, setPaymentPaidAmount] = useState(0);
  const [paymentRemainingAmount, setPaymentRemainingAmount] = useState(0);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<number | null>(null);
  const fetchData = async () => {
    try {
      const clientsRes = await api.get("/clients");
      const productsRes = await api.get("/products");
      const invoicesRes = await api.get("/invoices");

      setClients(clientsRes.data);
      setProducts(productsRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      toast.error("Failed to load invoices data");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchClient = invoice.client?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || invoice.status === statusFilter;

      return matchClient && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const exportInvoicesToExcel = () => {
    const data = filteredInvoices.map((invoice) => ({
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
      { wch: 24 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "invoices.xlsx");

    toast.success("Invoices exported successfully");
  };

  const addItem = () => {
    if (!productId || !quantity) {
      toast.error("Please select product and quantity");
      return;
    }

    const selectedProduct = products.find((p) => p.id === Number(productId));

    if (!selectedProduct) {
      toast.error("Product not found");
      return;
    }

    if (Number(quantity) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (Number(quantity) > selectedProduct.stock) {
      toast.error(`Only ${selectedProduct.stock} items available in stock`);
      return;
    }

    setItems([
      ...items,
      {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: Number(quantity),
      },
    ]);

    toast.success("Product added to invoice");

    setProductId("");
    setQuantity("1");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    toast.success("Product removed from invoice");
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || items.length === 0) {
      toast.error("Select client and add at least one product");
      return;
    }

    try {
      await api.post("/invoices", {
        clientId: Number(clientId),
        tvaRate: Number(tvaRate),
        discount: Number(discount),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      toast.success("Invoice created successfully");

      setClientId("");
      setProductId("");
      setQuantity("1");
      setTvaRate("20");
      setDiscount("0");
      setItems([]);

      fetchData();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invoice creation failed";

      toast.error(message);
    }
  };

  const startPayment = async (invoice: Invoice) => {
    try {
      const response = await api.get(`/payments/invoice/${invoice.id}`);
      const payments: Payment[] = response.data;

      const totalPaid = payments.reduce((sum, payment) => {
        return sum + Number(payment.amount);
      }, 0);

      const remaining = Number(invoice.totalTTC) - totalPaid;

      setPaymentInvoice(invoice);
      setPaymentPaidAmount(totalPaid);
      setPaymentRemainingAmount(remaining);
      setPaymentAmount("");
      setPaymentMethod("CASH");
    } catch (error) {
      toast.error("Failed to load invoice payments");
    }
  };

  const cancelPayment = () => {
    setPaymentInvoice(null);
    setPaymentAmount("");
    setPaymentMethod("CASH");
    setPaymentPaidAmount(0);
    setPaymentRemainingAmount(0);
  };

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentInvoice) return;

    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }

    if (Number(paymentAmount) > paymentRemainingAmount) {
      toast.error(
        `Payment amount cannot exceed remaining amount: ${paymentRemainingAmount} DH`
      );
      return;
    }

    try {
      await api.post("/payments", {
        invoiceId: paymentInvoice.id,
        amount: Number(paymentAmount),
        method: paymentMethod,
      });

      toast.success("Payment added successfully");

      cancelPayment();
      fetchData();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Payment operation failed";

      toast.error(message);
    }
  };

  const requestDeleteInvoice = (id: number) => {
  setDeleteInvoiceId(id);
};

const confirmDeleteInvoice = async () => {
  if (!deleteInvoiceId) return;

  try {
    await api.delete(`/invoices/${deleteInvoiceId}`);
    toast.success("Invoice deleted successfully");
    setDeleteInvoiceId(null);
    fetchData();
  } catch (error) {
    toast.error("Invoice delete failed");
  }
};

const cancelDeleteInvoice = () => {
  setDeleteInvoiceId(null);
};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Invoices Management</h3>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            Create invoices, filter by status, add payments and export to Excel.
          </p>
        </div>

        <button className="primary-button" onClick={exportInvoicesToExcel}>
          Export Excel
        </button>
      </div>

      <form onSubmit={createInvoice} className="card">
        <h3>Create Invoice</h3>

        <div className="form-grid grid-5">
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

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button type="button" className="secondary-button" onClick={addItem}>
            Add Product
          </button>

          <button type="submit" className="primary-button">
            Create Invoice
          </button>
        </div>

        {items.length > 0 && (
          <div style={{ marginTop: "18px" }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#f9fafb",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {item.productName} — quantity: {item.quantity}
                </span>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {paymentInvoice && (
        <form onSubmit={addPayment} className="card">
          <h3>Add Payment for Invoice #{paymentInvoice.id}</h3>

          <p style={{ color: "#6b7280", marginTop: 0 }}>
            Client: <strong>{paymentInvoice.client?.name}</strong> | Total TTC:{" "}
            <strong>{paymentInvoice.totalTTC} DH</strong> | Total Paid:{" "}
            <strong>{paymentPaidAmount} DH</strong> | Remaining:{" "}
            <strong>{paymentRemainingAmount} DH</strong> | Status:{" "}
            <span className={getStatusBadgeClass(paymentInvoice.status)}>
              {paymentInvoice.status}
            </span>
          </p>

          <div className="form-grid grid-3">
            <input
              type="number"
              placeholder="Payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">CASH</option>
              <option value="BANK_TRANSFER">BANK_TRANSFER</option>
              <option value="CARD">CARD</option>
            </select>

            <button type="submit" className="primary-button">
              Confirm Payment
            </button>
          </div>

          <div style={{ marginTop: "15px" }}>
            <button type="button" className="secondary-button" onClick={cancelPayment}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card">
        <h3>Filter Invoices</h3>

        <div className="form-grid grid-3">
          <input
            placeholder="Search by client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All status</option>
            <option value="PAID">PAID</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="UNPAID">UNPAID</option>
          </select>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Reset filters
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Total HT</th>
            <th>TVA</th>
            <th>Discount</th>
            <th>Total TTC</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredInvoices.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <div className="empty-state">No invoices found</div>
              </td>
            </tr>
          ) : (
            filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.client?.name}</td>
                <td>{invoice.totalHT} DH</td>
                <td>{invoice.tvaAmount} DH</td>
                <td>{invoice.discount} DH</td>
                <td>{invoice.totalTTC} DH</td>
                <td>
                  <span className={getStatusBadgeClass(invoice.status)}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <Link
                      className="secondary-button"
                      style={{ textDecoration: "none" }}
                      to={`/invoices/${invoice.id}`}
                    >
                      View
                    </Link>

                    {invoice.status !== "PAID" && (
                      <button
                        className="primary-button"
                        onClick={() => startPayment(invoice)}
                      >
                        Pay
                      </button>
                    )}

                    <button
                      className="danger-button"
                     onClick={() => requestDeleteInvoice(invoice.id)}
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
      {deleteInvoiceId && (
  <ConfirmModal
    title="Delete Invoice"
    message="Are you sure you want to delete this invoice? This action cannot be undone."
    confirmText="Delete"
    cancelText="Cancel"
    onConfirm={confirmDeleteInvoice}
    onCancel={cancelDeleteInvoice}
  />
)}
    </div>
  );
}

export default Invoices;
