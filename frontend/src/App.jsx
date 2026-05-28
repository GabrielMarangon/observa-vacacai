import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReportPage from "./pages/ReportPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import SurveyPage from "./pages/SurveyPage";
import AlertsPage from "./pages/AlertsPage";
import MapPage from "./pages/MapPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/denuncias/nova" element={<ReportPage />} />
        <Route path="/sugestoes" element={<SuggestionsPage />} />
        <Route path="/questionario" element={<SurveyPage />} />
        <Route path="/alertas" element={<AlertsPage />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route
          path="/gestor"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
