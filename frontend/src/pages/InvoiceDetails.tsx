import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type Product = {
  id: number;
  name: string;
};

type InvoiceItem = {
  id: number;
  productId: number;
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
  clientId: number;
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

function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const fetchInvoice = async () => {
    const response = await api.get(`/invoices/${id}`);
    setInvoice(response.data);
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  const formatInvoiceNumber = (id: number) => {
    return `INV-${String(id).padStart(4, "0")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const totalPaid =
    invoice?.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

  const remaining = invoice ? Number(invoice.totalTTC) - totalPaid : 0;

  useEffect(() => {
    fetchInvoice();
  }, []);

  if (!invoice) {
    return (
      <div className="card">
        <p>Chargement facture...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="invoice-actions no-print">
        <Link to="/invoices" className="secondary-button" style={{ textDecoration: "none" }}>
          Back to invoices
        </Link>

        <button className="primary-button" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <div className="invoice-page">
        <div className="invoice-header">
          <div className="company-block">
            <div className="company-logo">M</div>

            <div>
              <h1>MASSMEDIA</h1>
              <p>Solutions digitales & services informatiques</p>
              <p>Casablanca, Maroc</p>
              <p>Email: contact@massmedia.ma</p>
              <p>Tél: +212 6 00 00 00 00</p>
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
              <strong>Nom:</strong> {invoice.client?.name}
            </p>
            <p>
              <strong>Email:</strong> {invoice.client?.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {invoice.client?.phone}
            </p>
            <p>
              <strong>Adresse:</strong> {invoice.client?.address}
            </p>
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
                  <td>{item.unitPrice} DH</td>
                  <td>{item.total} DH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-bottom">
          <div className="payment-box">
            <h3>Paiements</h3>

            {invoice.payments && invoice.payments.length > 0 ? (
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Montant</th>
                    <th>Méthode</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {invoice.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.amount} DH</td>
                      <td>{payment.method}</td>
                      <td>{formatDate(payment.paidAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun paiement enregistré.</p>
            )}
          </div>

          <div className="totals-box">
            <h3>Résumé</h3>

            <div className="total-line">
              <span>Total HT</span>
              <strong>{invoice.totalHT} DH</strong>
            </div>

            <div className="total-line">
              <span>TVA ({invoice.tvaRate}%)</span>
              <strong>{invoice.tvaAmount} DH</strong>
            </div>

            <div className="total-line">
              <span>Remise</span>
              <strong>{invoice.discount} DH</strong>
            </div>

            <div className="total-line total-ttc">
              <span>Total TTC</span>
              <strong>{invoice.totalTTC} DH</strong>
            </div>

            <div className="total-line">
              <span>Total payé</span>
              <strong>{totalPaid} DH</strong>
            </div>

            <div className="total-line">
              <span>Reste</span>
              <strong>{remaining} DH</strong>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Merci pour votre confiance.</p>
          <p>MASSMEDIA — Facture générée automatiquement par Bills Management App.</p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
