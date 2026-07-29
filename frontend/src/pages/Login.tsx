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
    } catch (error) {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="massmedia-login-page">
      <div className="massmedia-login-left">
        <div className="massmedia-login-brand">
          <img src="/massmedia-logo.jpg" alt="MASSMEDIA" />
          <div>
            <h1>MASSMEDIA</h1>
            <p>Bills Management System</p>
          </div>
        </div>

        <div className="massmedia-lamp-zone">
          <div className="lamp-light"></div>

          <div className="cute-lamp">
            <div className="lamp-shade">
              <div className="lamp-eye left"></div>
              <div className="lamp-eye right"></div>
              <div className="lamp-mouth"></div>
              <div className="lamp-blush left"></div>
              <div className="lamp-blush right"></div>
            </div>

            <div className="lamp-neck"></div>
            <div className="lamp-pole"></div>
            <div className="lamp-base"></div>
          </div>
        </div>

        <div className="massmedia-login-text">
          <h2>Gestion de facturation moderne</h2>
          <p>
            Gérez vos clients, produits, factures, paiements, exports PDF/Excel
            et statistiques depuis une seule application.
          </p>
        </div>
      </div>

      <div className="massmedia-login-right">
  <div className="login-right-top">
    <span className="login-secure-dot"></span>
    <div>
      <strong>Secure Billing Access</strong>
      <p>Gestion sécurisée des factures et paiements</p>
    </div>
  </div>

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

  <div className="login-right-bottom">
    <div>
      <strong>PDF</strong>
      <span>Factures</span>
    </div>

    <div>
      <strong>Excel</strong>
      <span>Export</span>
    </div>

    <div>
      <strong>Stats</strong>
      <span>Dashboard</span>
    </div>
  </div>
</div>
    </div>
  );
}

export default Login;
