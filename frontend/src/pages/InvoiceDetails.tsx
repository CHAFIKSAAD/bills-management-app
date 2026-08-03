import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

type Product = {
  id: number;
  name: string;
};

type InvoiceItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: Product;
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
  client?: Client;
  items?: InvoiceItem[];
  payments?: Payment[];
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

function InvoiceDetails() {
  const { id } = useParams();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [companySettings, setCompanySettings] =
    useState<CompanySettings>(defaultCompanySettings);

  const fetchInvoice = async () => {
    const response = await api.get(`/invoices/${id}`);
    setInvoice(response.data);
  };

  const formatInvoiceNumber = (invoiceId: number) => {
    return `INV-${String(invoiceId).padStart(4, "0")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem("companySettings");

    if (savedSettings) {
      setCompanySettings(JSON.parse(savedSettings));
    }

    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return (
      <div className="card">
        <h3>Chargement de la facture...</h3>
      </div>
    );
  }

  const totalPaid =
    invoice.payments?.reduce((sum, payment) => {
      return sum + Number(payment.amount);
    }, 0) || 0;

  const remaining = Number(invoice.totalTTC) - totalPaid;

  return (
    <div>
      <div className="invoice-actions no-print">
        <Link to="/invoices" className="secondary-button">
          Back
        </Link>

        <button className="primary-button" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <div className="invoice-page">
        <div className="invoice-header">
          <div className="company-block">
            <img
              src="/massmedia-logo.jpg"
              alt={companySettings.companyName}
              className="invoice-company-logo"
            />

            <div>
              <h1>{companySettings.companyName}</h1>
              <p>{companySettings.tagline}</p>
              <p>{companySettings.address}</p>
              <p>Email: {companySettings.email}</p>
              <p>Tél: {companySettings.phone}</p>
            </div>
          </div>

          <div className="invoice-meta">
            <h2>FACTURE</h2>
            <p>
              <strong>N°:</strong> {formatInvoiceNumber(invoice.id)}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(invoice.createdAt)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={getStatusBadgeClass(invoice.status)}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Client</h3>

          <div className="client-box">
            <p>
              <strong>{invoice.client?.name}</strong>
            </p>
            <p>Email: {invoice.client?.email || "-"}</p>
            <p>Tél: {invoice.client?.phone || "-"}</p>
            <p>Adresse: {invoice.client?.address || "-"}</p>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Produits</h3>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items?.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.unitPrice} {companySettings.currency}
                  </td>
                  <td>
                    {item.total} {companySettings.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-bottom">
          <div className="payment-box">
            <h3>Paiements</h3>

            {invoice.payments && invoice.payments.length > 0 ? (
              invoice.payments.map((payment) => (
                <div key={payment.id} className="payment-line">
                  <span>{payment.method}</span>
                  <strong>
                    {payment.amount} {companySettings.currency}
                  </strong>
                </div>
              ))
            ) : (
              <p>Aucun paiement enregistré</p>
            )}
          </div>

          <div className="totals-box">
            <div className="total-line">
              <span>Total HT</span>
              <strong>
                {invoice.totalHT} {companySettings.currency}
              </strong>
            </div>

            <div className="total-line">
              <span>TVA ({invoice.tvaRate}%)</span>
              <strong>
                {invoice.tvaAmount} {companySettings.currency}
              </strong>
            </div>

            <div className="total-line">
              <span>Remise</span>
              <strong>
                {invoice.discount} {companySettings.currency}
              </strong>
            </div>

            <div className="total-line total-ttc">
              <span>Total TTC</span>
              <strong>
                {invoice.totalTTC} {companySettings.currency}
              </strong>
            </div>

            <div className="total-line">
              <span>Total payé</span>
              <strong>
                {totalPaid} {companySettings.currency}
              </strong>
            </div>

            <div className="total-line">
              <span>Reste</span>
              <strong>
                {remaining} {companySettings.currency}
              </strong>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          <p>
            Merci pour votre confiance — {companySettings.companyName}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
