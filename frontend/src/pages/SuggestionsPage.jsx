export default function SuggestionsPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Sugestoes da comunidade</h1>
        <p>Canal para propostas de melhoria, educacao ambiental e uso do territorio.</p>
        <form className="stack-form">
          <label>
            Tema
            <input type="text" placeholder="Ex.: recuperacao da mata ciliar" />
          </label>
          <label>
            Sua sugestao
            <textarea rows="5" placeholder="Escreva sua proposta" />
          </label>
          <button className="button" type="submit">
            Enviar sugestao
          </button>
        </form>
      </div>
    </section>
  );
}
