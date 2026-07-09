import { useEffect, useState } from "react";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
};

type Invoice = {
  id: number;
  totalTTC: number;
  status: string;
  client: Client;
};

type Payment = {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  paidAt: string;
  invoice: Invoice;
};

function Payments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");

  const fetchData = async () => {
    const invoicesRes = await api.get("/invoices");
    const paymentsRes = await api.get("/payments");

    setInvoices(invoicesRes.data);
    setPayments(paymentsRes.data);
  };

  const createPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId || !amount) {
      alert("Select invoice and enter amount");
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Payments</h1>

      <form onSubmit={createPayment} style={{ background: "white", padding: "20px", marginBottom: "25px" }}>
        <h3>Add Payment</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
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
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CHECK">Check</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "15px", padding: "8px 20px" }}>
          Add Payment
        </button>
      </form>

      <table style={{ width: "100%", background: "white", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Invoice</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Client</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Method</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Invoice Status</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>#{payment.invoiceId}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.invoice?.client?.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.amount} DH</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.method}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.invoice?.status}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {new Date(payment.paidAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;
