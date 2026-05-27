export default function SurveyPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Questionário comunitário</h1>
        <p>Espaço inicial para diagnóstico da percepção ambiental dos moradores.</p>
        <form className="stack-form">
          <label>
            Com que frequência você percebe alagamentos na sua região?
            <select>
              <option>Raramente</option>
              <option>Às vezes</option>
              <option>Frequentemente</option>
            </select>
          </label>
          <label>
            Quais são os principais problemas ambientais observados?
            <textarea rows="4" placeholder="Descreva sua percepção" />
          </label>
          <button className="button" type="submit">
            Responder questionário
          </button>
        </form>
      </div>
    </section>
  );
}
