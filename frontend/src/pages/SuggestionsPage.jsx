export default function SuggestionsPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Sugestões da comunidade</h1>
        <p>Canal para propostas de melhoria, educação ambiental e uso do território.</p>
        <form className="stack-form">
          <label>
            Tema
            <input type="text" placeholder="Ex.: recuperação da mata ciliar" />
          </label>
          <label>
            Sua sugestão
            <textarea rows="5" placeholder="Escreva sua proposta" />
          </label>
          <button className="button" type="submit">
            Enviar sugestão
          </button>
        </form>
      </div>
    </section>
  );
}
