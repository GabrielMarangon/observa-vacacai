import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.ready) {
    return (
      <section className="page narrow-page">
        <div className="form-card">
          <h1>Verificando acesso</h1>
          <p>Estamos validando sua sessão administrativa.</p>
        </div>
      </section>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
