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

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName = user?.name || "User";
  const userRole = user?.role || "USER";
  const userInitial = userName.charAt(0).toUpperCase();

  const currentPage = location.pathname.startsWith("/invoices/")
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
          <img src="/massmedia-logo.jpg" alt="MASSMEDIA" className="brand-logo-img" />

          <div>
            <h2>MASSMEDIA</h2>
            <span>Bills Management System</span>
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
            <div className="user-avatar">{userInitial}</div>

            <div>
              <strong>{userName}</strong>
              <span>{userRole}</span>
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
