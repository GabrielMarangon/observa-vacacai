import { useState } from "react";
import { apiFetch } from "../lib/api";

const occurrenceTypes = [
  "Descarte irregular de lixo",
  "Esgoto no rio",
  "Desmatamento de mata ciliar",
  "Erosão",
  "Ocupação irregular",
  "Queimadas",
  "Outros",
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    type: occurrenceTypes[0],
    description: "",
    reporterName: "",
    contact: "",
    anonymous: false,
    latitude: "",
    longitude: "",
  });
  const [feedback, setFeedback] = useState({
    loading: false,
    error: "",
    success: "",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ loading: true, error: "", success: "" });

    try {
      const payload = await apiFetch("/api/reports", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setFeedback({
        loading: false,
        error: "",
        success: payload.message,
      });
      setFormData({
        type: occurrenceTypes[0],
        description: "",
        reporterName: "",
        contact: "",
        anonymous: false,
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      setFeedback({
        loading: false,
        error: error.message,
        success: "",
      });
    }
  }

  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Nova denúncia</h1>
        <p>Fluxo inicial para registro de ocorrências ambientais com georreferenciamento.</p>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            Tipo da ocorrência
            <select name="type" value={formData.type} onChange={handleChange}>
              {occurrenceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descrição
            <textarea
              name="description"
              rows="5"
              placeholder="Descreva o ocorrido"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Nome do denunciante
            <input
              name="reporterName"
              type="text"
              placeholder="Opcional"
              value={formData.reporterName}
              onChange={handleChange}
              disabled={formData.anonymous}
            />
          </label>
          <label>
            Contato
            <input
              name="contact"
              type="text"
              placeholder="Telefone ou e-mail"
              value={formData.contact}
              onChange={handleChange}
              disabled={formData.anonymous}
            />
          </label>
          <label className="checkbox-row">
            <input
              name="anonymous"
              type="checkbox"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            Enviar denúncia de forma anônima
          </label>
          <div className="form-grid">
            <label>
              Latitude
              <input
                name="latitude"
                type="number"
                step="any"
                placeholder="-30.3361"
                value={formData.latitude}
                onChange={handleChange}
              />
            </label>
            <label>
              Longitude
              <input
                name="longitude"
                type="number"
                step="any"
                placeholder="-54.3218"
                value={formData.longitude}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Imagem
            <input type="text" placeholder="Campo reservado para upload futuro" disabled />
          </label>
          {feedback.error ? <p className="feedback-error">{feedback.error}</p> : null}
          {feedback.success ? <p className="feedback-success">{feedback.success}</p> : null}
          <button className="button" type="submit">
            {feedback.loading ? "Enviando..." : "Enviar denúncia"}
          </button>
        </form>
      </div>
    </section>
  );
}
