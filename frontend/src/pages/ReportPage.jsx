import { useRef, useState } from "react";
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

const maxImageSizeBytes = 4 * 1024 * 1024;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
    reader.readAsDataURL(file);
  });
}

export default function ReportPage() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    type: occurrenceTypes[0],
    description: "",
    address: "",
    referencePoint: "",
    reporterName: "",
    contact: "",
    anonymous: false,
    latitude: "",
    longitude: "",
    imageDataUrl: "",
    imageName: "",
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

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((current) => ({
        ...current,
        imageDataUrl: "",
        imageName: "",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback({
        loading: false,
        error: "Selecione um arquivo de imagem válido.",
        success: "",
      });
      event.target.value = "";
      return;
    }

    if (file.size > maxImageSizeBytes) {
      setFeedback({
        loading: false,
        error: "A imagem deve ter no máximo 4 MB.",
        success: "",
      });
      event.target.value = "";
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(file);
      setFormData((current) => ({
        ...current,
        imageDataUrl,
        imageName: file.name,
      }));
      setFeedback((current) => ({
        ...current,
        error: "",
      }));
    } catch (error) {
      setFeedback({
        loading: false,
        error: error.message,
        success: "",
      });
      event.target.value = "";
    }
  }

  function clearImage() {
    setFormData((current) => ({
      ...current,
      imageDataUrl: "",
      imageName: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        address: "",
        referencePoint: "",
        reporterName: "",
        contact: "",
        anonymous: false,
        latitude: "",
        longitude: "",
        imageDataUrl: "",
        imageName: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        <p>
          Você pode registrar uma ocorrência ambiental sem criar conta, informando
          o endereço do local e, se possível, anexando uma foto.
        </p>
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
            Endereço ou ponto principal da ocorrência
            <input
              name="address"
              type="text"
              placeholder="Ex.: Avenida Francisco Chagas, margem do rio"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
          <label>
            Referência complementar
            <input
              name="referencePoint"
              type="text"
              placeholder="Ex.: próximo à ponte, praça ou escola"
              value={formData.referencePoint}
              onChange={handleChange}
            />
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
              Latitude (opcional)
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
              Longitude (opcional)
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
          <p className="form-helper">
            Se você souber as coordenadas, elas ajudam no mapa. Caso contrário,
            basta informar bem o endereço e a referência.
          </p>
          <label>
            Foto do local
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          <p className="form-helper">
            Formatos comuns de imagem são aceitos. Tamanho máximo: 4 MB.
          </p>
          {formData.imageDataUrl ? (
            <div className="image-preview-card">
              <img
                className="image-preview"
                src={formData.imageDataUrl}
                alt="Pré-visualização da denúncia"
              />
              <div className="image-preview-meta">
                <strong>{formData.imageName}</strong>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={clearImage}
                >
                  Remover imagem
                </button>
              </div>
            </div>
          ) : null}
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
