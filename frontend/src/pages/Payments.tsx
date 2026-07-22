import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
};

type Invoice = {
  id: number;
  totalTTC: number;
  status: string;
  client?: Client;
};

type Payment = {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  paidAt: string;
  invoice?: Invoice;
};

function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchData = async () => {
    const paymentsRes = await api.get("/payments");
    const invoicesRes = await api.get("/invoices");

    setPayments(paymentsRes.data);
    setInvoices(invoicesRes.data);
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const clientName = payment.invoice?.client?.name || "";
      const invoiceNumber = `#${payment.invoiceId}`;

      const matchSearch =
        clientName.toLowerCase().includes(search.toLowerCase()) ||
        invoiceNumber.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || payment.invoice?.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [payments, search, statusFilter]);

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId || !amount || Number(amount) <= 0) {
      alert("Please select invoice and enter a valid amount");
      return;
    }

    await api.post("/payments", {
      invoiceId: Number(invoiceId),
      amount: Number(amount),
      method,
    });

    setInvoiceId("");
    setAmount("");
    setMethod("CASH");

    fetchData();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
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
          <h3 style={{ margin: 0 }}>Payments Management</h3>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            Add payments, follow invoice status and filter payment history.
          </p>
        </div>
      </div>

      <form onSubmit={addPayment} className="card">
        <h3>Add Payment</h3>

        <div className="form-grid grid-3">
          <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
            <option value="">Select invoice</option>

            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                Invoice #{invoice.id} - {invoice.client?.name} - {invoice.totalTTC} DH - {invoice.status}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="CASH">CASH</option>
            <option value="BANK_TRANSFER">BANK_TRANSFER</option>
            <option value="CARD">CARD</option>
          </select>
        </div>

        <div style={{ marginTop: "15px" }}>
          <button type="submit" className="primary-button">
            Add Payment
          </button>
        </div>
      </form>

      <div className="card">
        <h3>Filter Payments</h3>

        <div className="form-grid grid-3">
          <input
            placeholder="Search by client or invoice number..."
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
            <th>Invoice</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Invoice Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayments.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className="empty-state">No payments found</div>
              </td>
            </tr>
          ) : (
            filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>#{payment.invoiceId}</td>
                <td>{payment.invoice?.client?.name}</td>
                <td>{payment.amount} DH</td>
                <td>{payment.method}</td>
                <td>
                  <span className={getStatusBadgeClass(payment.invoice?.status || "UNPAID")}>
                    {payment.invoice?.status}
                  </span>
                </td>
                <td>{formatDate(payment.paidAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;
