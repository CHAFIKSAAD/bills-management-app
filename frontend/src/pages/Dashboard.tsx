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
  createdAt: string;
  client?: Client;
};

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  category?: Category;
};

type DashboardStats = {
  clientsCount: number;
  productsCount: number;
  invoicesCount: number;
  paidInvoicesCount: number;
  partialInvoicesCount: number;
  unpaidInvoicesCount: number;
  totalRevenue: number;
  totalStock: number;
};

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get("/dashboard");
      const invoicesRes = await api.get("/invoices");
      const productsRes = await api.get("/products");

      setStats(statsRes.data);
      setInvoices(invoicesRes.data);
      setProducts(productsRes.data);
    } catch (err: any) {
      console.log("Dashboard error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      setError("Impossible de charger le dashboard. Vérifie que le backend et Docker sont lancés.");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  const getStockBadgeClass = (stock: number) => {
    if (stock === 0) return "badge badge-unpaid";
    if (stock <= 5) return "badge badge-partial";
    return "badge badge-paid";
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "OUT OF STOCK";
    if (stock <= 5) return "LOW STOCK";
    return "IN STOCK";
  };

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [invoices]);

  const lowStockProducts = useMemo(() => {
    return products
      .filter((product) => product.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [products]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="card">
        <h3>Erreur</h3>
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Clients</h3>
          <p>{stats.clientsCount}</p>
        </div>

        <div className="stat-card">
          <h3>Produits</h3>
          <p>{stats.productsCount}</p>
        </div>

        <div className="stat-card">
          <h3>Factures</h3>
          <p>{stats.invoicesCount}</p>
        </div>

        <div className="stat-card">
          <h3>Revenus</h3>
          <p>{stats.totalRevenue} DH</p>
        </div>

        <div className="stat-card">
          <h3>Stock total</h3>
          <p>{stats.totalStock}</p>
        </div>

        <div className="stat-card">
          <h3>Payees</h3>
          <p>{stats.paidInvoicesCount}</p>
        </div>

        <div className="stat-card">
          <h3>Partielles</h3>
          <p>{stats.partialInvoicesCount}</p>
        </div>

        <div className="stat-card">
          <h3>Impayees</h3>
          <p>{stats.unpaidInvoicesCount}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "22px",
          marginTop: "28px",
        }}
      >
        <div className="card">
          <h3>Dernières factures</h3>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">Aucune facture trouvée</div>
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>#{invoice.id}</td>
                    <td>{invoice.client?.name}</td>
                    <td>{invoice.totalTTC} DH</td>
                    <td>
                      <span className={getStatusBadgeClass(invoice.status)}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Alertes stock faible</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-state">Aucun stock faible</div>
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={getStockBadgeClass(product.stock)}>
                        {getStockLabel(product.stock)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
