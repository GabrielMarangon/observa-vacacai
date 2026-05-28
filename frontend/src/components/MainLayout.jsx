import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const publicNavItems = [
  { to: "/", label: "Início" },
  { to: "/denuncias/nova", label: "Nova denúncia" },
  { to: "/mapa", label: "Mapa" },
];

export default function MainLayout({ children }) {
  const auth = useAuth();
  const navItems = auth.isAuthenticated
    ? [...publicNavItems, { to: "/gestor", label: "Painel do gestor" }]
    : publicNavItems;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">OV</span>
          <span>
            <strong>Observa Vacacaí</strong>
            <small>São Gabriel/RS</small>
          </span>
        </Link>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="auth-actions">
          {auth.isAuthenticated ? (
            <>
              <span className="auth-chip">Gestor conectado</span>
              <button className="button" type="button" onClick={auth.logout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="button button-secondary">
              Acesso do gestor
            </Link>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <p>Observa Vacacaí | São Gabriel/RS</p>
      </footer>
    </div>
  );
}
