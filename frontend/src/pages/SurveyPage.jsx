export default function SurveyPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Questionario comunitario</h1>
        <p>Espaco inicial para diagnostico de percepcao ambiental dos moradores.</p>
        <form className="stack-form">
          <label>
            Com que frequencia voce percebe alagamentos na sua regiao?
            <select>
              <option>Raramente</option>
              <option>As vezes</option>
              <option>Frequentemente</option>
            </select>
          </label>
          <label>
            Quais os principais problemas ambientais observados?
            <textarea rows="4" placeholder="Descreva sua percepcao" />
          </label>
          <button className="button" type="submit">
            Responder questionario
          </button>
        </form>
      </div>
    </section>
  );
}
