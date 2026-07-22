import { NavLink, Outlet, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/categories": "Categories",
  "/products": "Products",
  "/invoices": "Invoices",
  "/payments": "Payments",
};

function Layout() {
  const location = useLocation();

  const currentPage =
  location.pathname.startsWith("/invoices/")
    ? "Invoice Details"
    : pageTitles[location.pathname] || "Bills App";
    
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <div className="brand">
          <div className="brand-icon">B</div>
          <div>
            <h2>Bills App</h2>
            <span>Management System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <span>📊</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/clients"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <span>👥</span>
            Clients
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <span>🏷️</span>
            Categories
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <span>📦</span>
            Products
          </NavLink>

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <span>🧾</span>
            Invoices
          </NavLink>

          <NavLink
            to="/payments"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <span>💳</span>
            Payments
          </NavLink>
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar no-print">
          <div>
            <p className="topbar-subtitle">Bills Management App</p>
            <h2>{currentPage}</h2>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">S</div>
            <div>
              <strong>Saad</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <section className="page-container">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default Layout;
