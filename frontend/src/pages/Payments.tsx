import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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

type CompanySettings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  defaultTva: string;
  currency: string;
};

const defaultCompanySettings: CompanySettings = {
  companyName: "MASSMEDIA",
  tagline: "Impacting business",
  email: "contact@massmedia.ma",
  phone: "+212 6 00 00 00 00",
  address: "Casablanca, Maroc",
  city: "Casablanca",
  defaultTva: "20",
  currency: "DH",
};

function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(
  defaultCompanySettings
);
  const formatInvoiceNumber = (id: number) => {
  return `INV-${String(id).padStart(4, "0")}`;
};
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const paymentsRes = await api.get("/payments");
      const invoicesRes = await api.get("/invoices");

      setPayments(paymentsRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      toast.error("Failed to load payments");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const clientName = payment.invoice?.client?.name || "";
      const invoiceNumber = formatInvoiceNumber(payment.invoiceId);

      const matchSearch =
        clientName.toLowerCase().includes(search.toLowerCase()) ||
        invoiceNumber.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || payment.invoice?.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [payments, search, statusFilter]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInvoicePaidAmount = (selectedInvoiceId: number) => {
    return payments
      .filter((payment) => payment.invoiceId === selectedInvoiceId)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
  };

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId || !amount || Number(amount) <= 0) {
      toast.error("Please select invoice and enter a valid amount");
      return;
    }

    const selectedInvoice = invoices.find(
      (invoice) => invoice.id === Number(invoiceId)
    );

    if (!selectedInvoice) {
      toast.error("Invoice not found");
      return;
    }

    if (selectedInvoice.status === "PAID") {
      toast.error("This invoice is already paid");
      return;
    }

    const totalPaid = getInvoicePaidAmount(selectedInvoice.id);
    const remaining = Number(selectedInvoice.totalTTC) - totalPaid;

    if (Number(amount) > remaining) {
      toast.error(
  `Payment amount cannot exceed remaining amount: ${remaining} ${companySettings.currency}`
);
      return;
    }

    try {
      await api.post("/payments", {
        invoiceId: Number(invoiceId),
        amount: Number(amount),
        method,
      });

      toast.success("Payment added successfully");

      setInvoiceId("");
      setAmount("");
      setMethod("CASH");

      fetchData();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Payment operation failed";

      toast.error(message);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
  const savedSettings = localStorage.getItem("companySettings");

  if (savedSettings) {
    setCompanySettings(JSON.parse(savedSettings));
  }

  fetchData();
}, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Payments Management</h3>

        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Add payments, follow invoice status and filter payment history.
        </p>
      </div>

      <form onSubmit={addPayment} className="card">
        <h3>Add Payment</h3>

        <div className="form-grid grid-3">
          <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
            <option value="">Select invoice</option>

            {invoices
              .filter((invoice) => invoice.status !== "PAID")
              .map((invoice) => {
                const totalPaid = getInvoicePaidAmount(invoice.id);
                const remaining = Number(invoice.totalTTC) - totalPaid;

                return (
                  <option key={invoice.id} value={invoice.id}>
                    {formatInvoiceNumber(invoice.id)} - {invoice.client?.name} - Remaining {remaining} {companySettings.currency} - {invoice.status}
                  </option>
                );
              })}
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

        <div className="table-counter" style={{ marginTop: "12px" }}>
          {filteredPayments.length} payment(s) found
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
          {paginatedPayments.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className="empty-state">No payments found</div>
              </td>
            </tr>
          ) : (
            paginatedPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{formatInvoiceNumber(payment.invoiceId)}</td>
                <td>{payment.invoice?.client?.name}</td>
                <td>
  {payment.amount} {companySettings.currency}
</td>
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
    </div>
  );
}

export default Payments;
