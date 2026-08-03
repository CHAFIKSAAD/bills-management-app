import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <img src="/massmedia-logo.jpg" alt="MASSMEDIA" />

        <h1>404</h1>
        <h2>Page introuvable</h2>

        <p>
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>

        <Link to="/dashboard" className="primary-button not-found-button">
          Retour au Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
