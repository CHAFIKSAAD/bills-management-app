import { Link, Outlet } from "react-router-dom";

function Layout() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <div className="sidebar-title">Bills App</div>

        <nav className="sidebar-nav">
          <Link className="sidebar-link" to="/dashboard">Dashboard</Link>
          <Link className="sidebar-link" to="/clients">Clients</Link>
          <Link className="sidebar-link" to="/categories">Categories</Link>
          <Link className="sidebar-link" to="/products">Products</Link>
          <Link className="sidebar-link" to="/invoices">Invoices</Link>
          <Link className="sidebar-link" to="/payments">Payments</Link>
        </nav>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
