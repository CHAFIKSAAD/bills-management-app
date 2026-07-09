import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

type InvoiceItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  total: number;
  product: {
    id: number;
    name: string;
  };
};

type Payment = {
  id: number;
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
  createdAt: string;
  client: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
};

function InvoiceDetails() {
  const { id } = useParams();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchInvoice = async () => {
    const invoiceRes = await api.get(`/invoices/${id}`);
    const paymentsRes = await api.get(`/payments/invoice/${id}`);

    setInvoice(invoiceRes.data);
    setPayments(paymentsRes.data);
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  if (!invoice) {
    return <p>Loading...</p>;
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = invoice.totalTTC - totalPaid;

  return (
    <div>
      <Link className="no-print" to="/invoices">Back to invoices</Link>

      <h1>Invoice #{invoice.id}</h1>
      <button
  className="no-print"
  onClick={() => window.print()}
  style={{ marginBottom: "20px", padding: "8px 20px" }}
>
  Print / Save as PDF
</button>

      <div style={{ background: "white", padding: "20px", marginBottom: "20px" }}>
        <h3>Client</h3>
        <p><strong>Name:</strong> {invoice.client.name}</p>
        <p><strong>Email:</strong> {invoice.client.email}</p>
        <p><strong>Phone:</strong> {invoice.client.phone}</p>
        <p><strong>Address:</strong> {invoice.client.address}</p>
      </div>

      <div style={{ background: "white", padding: "20px", marginBottom: "20px" }}>
        <h3>Products</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Product</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Quantity</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Unit Price</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.product.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.unitPrice} DH</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.total} DH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "white", padding: "20px", marginBottom: "20px" }}>
        <h3>Totals</h3>
        <p><strong>Total HT:</strong> {invoice.totalHT} DH</p>
        <p><strong>TVA:</strong> {invoice.tvaAmount} DH</p>
        <p><strong>Discount:</strong> {invoice.discount} DH</p>
        <p><strong>Total TTC:</strong> {invoice.totalTTC} DH</p>
        <p><strong>Total Paid:</strong> {totalPaid} DH</p>
        <p><strong>Remaining:</strong> {remaining} DH</p>
        <p><strong>Status:</strong> {invoice.status}</p>
      </div>

      <div style={{ background: "white", padding: "20px" }}>
        <h3>Payments</h3>

        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Method</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.amount} DH</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{payment.method}</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    {new Date(payment.paidAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InvoiceDetails;
