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
    <div className="lamp-login-page">
      <div className="lamp-login-wrapper">
        <div className="cute-lamp-zone">
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

        <form onSubmit={login} className="lamp-login-card">
          <img
            src="/massmedia-logo.jpg"
            alt="MASSMEDIA"
            className="lamp-login-logo"
          />

          <h1>Welcome Back</h1>
          <p>Connectez-vous à votre espace MASSMEDIA</p>

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

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Login"}
          </button>

          <div className="lamp-login-demo">
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
