import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [feedback, setFeedback] = useState({
    loading: false,
    error: "",
  });

  const redirectTo = location.state?.from?.pathname || "/gestor";

  if (auth.ready && auth.isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ loading: true, error: "" });

    try {
      await auth.login(formData);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFeedback({
        loading: false,
        error: error.message,
      });
    }
  }

  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Acesso do gestor</h1>
        <p>
          Esta área é restrita a gestores e administradores. Moradores podem usar
          o sistema e registrar denúncias sem login.
        </p>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              placeholder="gestor@exemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          {feedback.error ? <p className="feedback-error">{feedback.error}</p> : null}
          <button className="button" type="submit">
            {feedback.loading ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
        <div className="inline-actions">
          <Link to="/denuncias/nova" className="button button-secondary">
            Registrar denúncia pública
          </Link>
        </div>
      </div>
    </section>
  );
}
