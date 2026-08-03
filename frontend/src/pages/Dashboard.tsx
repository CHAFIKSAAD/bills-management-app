import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

type Product = {
  id: number;
  name: string;
  stock: number;
};

type DashboardStats = Record<string, any>;

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

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(
  defaultCompanySettings
  );
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("dashboardViewMode") || "cards"
  );

  const redColors = ["#ef2424", "#b91c1c", "#f97316", "#16a34a", "#2563eb"];

  const getNumber = (...keys: string[]) => {
    for (const key of keys) {
      if (stats[key] !== undefined && stats[key] !== null) {
        return Number(stats[key]);
      }
    }

    return 0;
  };

  const dashboardValues = useMemo(() => {
  const calculatedRevenue = invoices.reduce((sum, invoice) => {
    return sum + Number(invoice.totalTTC);
  }, 0);

  const calculatedStock = products.reduce((sum, product) => {
    return sum + Number(product.stock);
  }, 0);

  const calculatedPaid = invoices.filter(
    (invoice) => invoice.status === "PAID"
  ).length;

  const calculatedPartial = invoices.filter(
    (invoice) => invoice.status === "PARTIAL"
  ).length;

  const calculatedUnpaid = invoices.filter(
    (invoice) => invoice.status === "UNPAID"
  ).length;

  return {
    clients: getNumber("clients", "totalClients", "clientsCount") || clients.length,
    products: getNumber("products", "totalProducts", "productsCount") || products.length,
    invoices: getNumber("invoices", "totalInvoices", "invoicesCount") || invoices.length,
    revenue: getNumber("revenue", "revenues", "totalRevenue") || calculatedRevenue,
    stock: getNumber("stock", "totalStock") || calculatedStock,
    paid: getNumber("paidInvoices", "paid", "payees") || calculatedPaid,
    partial: getNumber("partialInvoices", "partial", "partielles") || calculatedPartial,
    unpaid: getNumber("unpaidInvoices", "unpaid", "impayees") || calculatedUnpaid,
  };
}, [stats, clients, products, invoices]);

  const mainStats = [
    { label: "Clients", value: dashboardValues.clients, suffix: "" },
    { label: "Produits", value: dashboardValues.products, suffix: "" },
    { label: "Factures", value: dashboardValues.invoices, suffix: "" },
    { label: "Revenus", value: dashboardValues.revenue, suffix: ` ${companySettings.currency}`,},
    { label: "Stock total", value: dashboardValues.stock, suffix: "" },
    { label: "Payées", value: dashboardValues.paid, suffix: "" },
    { label: "Partielles", value: dashboardValues.partial, suffix: "" },
    { label: "Impayées", value: dashboardValues.unpaid, suffix: "" },
  ];

  const invoiceStatusData = [
    { name: "Payées", value: dashboardValues.paid },
    { name: "Partielles", value: dashboardValues.partial },
    { name: "Impayées", value: dashboardValues.unpaid },
  ];

  const barData = [
    { name: "Clients", value: dashboardValues.clients },
    { name: "Produits", value: dashboardValues.products },
    { name: "Factures", value: dashboardValues.invoices },
    { name: "Stock", value: dashboardValues.stock },
  ];

  const revenueData = [
    {
      name: "Revenus",
      value: dashboardValues.revenue,
    },
  ];

  const recentInvoices = invoices.slice(0, 5);

  const lowStockProducts = products.filter((product) => product.stock <= 5);

  const fetchData = async () => {
    try {
      const statsRes = await api.get("/dashboard");
const clientsRes = await api.get("/clients");
const invoicesRes = await api.get("/invoices");
const productsRes = await api.get("/products");

setStats(statsRes.data);
setClients(clientsRes.data);
setInvoices(invoicesRes.data);
setProducts(productsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "PAID") return "badge badge-paid";
    if (status === "PARTIAL") return "badge badge-partial";
    return "badge badge-unpaid";
  };

  const changeViewMode = (mode: string) => {
    setViewMode(mode);
    localStorage.setItem("dashboardViewMode", mode);
  };

  useEffect(() => {
  const savedSettings = localStorage.getItem("companySettings");

  if (savedSettings) {
    setCompanySettings(JSON.parse(savedSettings));
  }

  fetchData();
}, []);

  return (
    <div>
      <div className="dashboard-header-card">
        <div>
          <h3>Dashboard Overview</h3>
          <p>
            Visualisez les statistiques sous forme de cartes, cercles ou graphes.
          </p>
        </div>

        <select
          className="dashboard-view-select"
          value={viewMode}
          onChange={(e) => changeViewMode(e.target.value)}
        >
          <option value="cards">Cards</option>
          <option value="circles">Cercles</option>
          <option value="charts">Graphes</option>
        </select>
      </div>

      {viewMode === "cards" && (
        <div className="stats-grid">
          {mainStats.map((item) => (
            <div className="stat-card" key={item.label}>
              <h3>{item.label}</h3>
              <p>
                {item.value}
                {item.suffix}
              </p>
            </div>
          ))}
        </div>
      )}

      {viewMode === "circles" && (
        <div className="circle-stats-grid">
          {mainStats.map((item, index) => (
            <div className="circle-stat-card" key={item.label}>
              <div
                className="circle-stat"
                style={{
                  background: `conic-gradient(${redColors[index % redColors.length]} 0deg 300deg, #fee2e2 300deg 360deg)`,
                }}
              >
                <div className="circle-stat-inner">
                  <strong>
                    {item.value}
                    {item.suffix}
                  </strong>
                </div>
              </div>

              <h3>{item.label}</h3>
            </div>
          ))}
        </div>
      )}

      {viewMode === "charts" && (
        <div className="dashboard-charts-grid">
          <div className="card chart-card">
            <h3>Statistiques générales</h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ef2424" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <h3>État des factures</h3>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {invoiceStatusData.map((_, index) => (
                    <Cell key={index} fill={redColors[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <h3>Revenus</h3>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#b91c1c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="dashboard-bottom-grid">
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
                    <td>
  {invoice.totalTTC} {companySettings.currency}
</td>
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
                      {product.stock === 0 ? (
                        <span className="badge badge-unpaid">OUT OF STOCK</span>
                      ) : (
                        <span className="badge badge-partial">LOW STOCK</span>
                      )}
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
