import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("saad@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <img src="/massmedia-logo.jpg" alt="MASSMEDIA" className="login-company-logo" />

          <div>
            <h1>MASSMEDIA</h1>
            <p>Bills Management System</p>
          </div>
        </div>

        <div className="login-info">
          <h2>Gestion de facturation moderne</h2>

          <p>
            Gérez vos clients, produits, factures, paiements, exports PDF/Excel
            et statistiques depuis une seule application.
          </p>

          <div className="login-features">
            <span>✔ Clients</span>
            <span>✔ Produits</span>
            <span>✔ Factures</span>
            <span>✔ Paiements</span>
            <span>✔ Dashboard</span>
            <span>✔ Exports</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <form onSubmit={login} className="login-card">
          <h2>Connexion</h2>

          <p>Connectez-vous à votre espace de gestion</p>

          <label>Email</label>
          <input
            type="email"
            placeholder="saad@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="login-demo">
            <strong>Compte de test</strong>
            <span>Email: saad@test.com</span>
            <span>Password: 123456</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
