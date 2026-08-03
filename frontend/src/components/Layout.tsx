import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/categories": "Categories",
  "/products": "Products",
  "/invoices": "Invoices",
  "/payments": "Payments",
  "/profile": "Profile",
  "/settings": "Settings",
};

function Layout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const formatRole = (role: string) => {
    if (role === "USER") return "Utilisateur";
    if (role === "ADMIN") return "Admin";
    return role;
  };

  const userName = user?.name || "User";
  const userRole = formatRole(user?.role || "USER");
  const userInitial = userName.charAt(0).toUpperCase();

  const currentPage = location.pathname.startsWith("/invoices/")
    ? "Invoice Details"
    : pageTitles[location.pathname] || "Bills App";

  const getBreadcrumb = () => {
    if (location.pathname.startsWith("/invoices/")) {
      return [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Invoices", path: "/invoices" },
        { label: "Invoice Details", path: "" },
      ];
    }

    return [
      { label: "Dashboard", path: "/dashboard" },
      { label: currentPage, path: "" },
    ];
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="app-layout">
      {mobileSidebarOpen && (
        <div className="mobile-overlay no-print" onClick={closeMobileSidebar} />
      )}

      <aside className={`sidebar no-print ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <img
            src="/massmedia-logo.jpg"
            alt="MASSMEDIA"
            className="brand-logo-img"
          />

          <div>
            <h2>MASSMEDIA</h2>
            <span>Bills Management System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>📊</span>
            Dashboard
          </NavLink>

          <NavLink to="/clients" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>👥</span>
            Clients
          </NavLink>

          <NavLink to="/categories" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>🏷️</span>
            Categories
          </NavLink>

          <NavLink to="/products" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>📦</span>
            Products
          </NavLink>

          <NavLink to="/invoices" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>🧾</span>
            Invoices
          </NavLink>

          <NavLink to="/payments" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>💳</span>
            Payments
          </NavLink>

          <NavLink to="/profile" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>👤</span>
            Profile
          </NavLink>

          <NavLink to="/settings" onClick={closeMobileSidebar} className={({ isActive }) => isActive ? "sidebar-link active-link" : "sidebar-link"}>
            <span>⚙️</span>
            Settings
          </NavLink>
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar no-print">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileSidebarOpen(true)}
            >
              ☰
            </button>

            <div>
              <p className="topbar-subtitle">Bills Management App</p>
              <h2>{currentPage}</h2>

              <div className="breadcrumb">
                {breadcrumb.map((item, index) => (
                  <span key={index}>
                    {item.path ? (
                      <Link to={item.path}>{item.label}</Link>
                    ) : (
                      <strong>{item.label}</strong>
                    )}

                    {index < breadcrumb.length - 1 && <em>/</em>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="topbar-user-wrapper">
            <button
              className="topbar-user topbar-user-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar">{userInitial}</div>

              <div>
                <strong>{userName}</strong>
                <span>{userRole}</span>
              </div>

              <span className="dropdown-arrow">▾</span>
            </button>

            {userMenuOpen && (
              <div className="user-dropdown">
                <NavLink to="/profile" onClick={() => setUserMenuOpen(false)}>
                  👤 Profile
                </NavLink>

                <NavLink to="/settings" onClick={() => setUserMenuOpen(false)}>
                  ⚙️ Settings
                </NavLink>

                <button onClick={logout}>🚪 Logout</button>
              </div>
            )}
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
