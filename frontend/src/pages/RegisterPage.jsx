import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Cadastro não obrigatório</h1>
        <p>
          O uso público do Observa Vacacai não exige cadastro neste momento.
          Moradores podem registrar denúncias de forma identificada ou anônima.
        </p>
        <div className="inline-actions">
          <Link to="/denuncias/nova" className="button">
            Fazer uma denúncia
          </Link>
          <Link to="/admin/login" className="button button-secondary">
            Acesso do gestor
          </Link>
        </div>
      </div>
    </section>
  );
}
