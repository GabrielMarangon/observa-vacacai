import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/denuncias/nova", label: "Nova denuncia" },
  { to: "/sugestoes", label: "Sugestoes" },
  { to: "/questionario", label: "Questionario" },
  { to: "/alertas", label: "Alertas" },
  { to: "/mapa", label: "Mapa" },
  { to: "/gestor", label: "Painel do gestor" },
];

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">OV</span>
          <span>
            <strong>Observa Vacacai</strong>
            <small>Participacao cidada no Rio Vacacai</small>
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
          <Link to="/login" className="button button-secondary">
            Entrar
          </Link>
          <Link to="/cadastro" className="button">
            Criar conta
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <p>Observa Vacacai • Sao Gabriel/RS • Monitoramento socioambiental colaborativo</p>
      </footer>
    </div>
  );
}
