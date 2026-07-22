import { useEffect, useState } from "react";
import api from "../services/api";

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
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard");
      setStats(response.data);
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

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <div>
        <div className="card">
          <h3>Erreur</h3>
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        </div>
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
    </div>
  );
}

export default Dashboard;
