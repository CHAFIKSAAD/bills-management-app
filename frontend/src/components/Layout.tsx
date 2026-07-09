import { Link, Outlet } from "react-router-dom";

function Layout() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      <aside className="no-print" style={{ width: "220px", background: "#111827", color: "white", padding: "20px" }}>
        <h2>Bills App</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
          <Link style={{ color: "white", textDecoration: "none" }} to="/dashboard">Dashboard</Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/clients">Clients</Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/categories">Categories</Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/products">Products</Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/invoices">Invoices</Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/payments">Payments</Link>
        </nav>

        <button onClick={logout} style={{ marginTop: "40px", padding: "8px", width: "100%" }}>
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
