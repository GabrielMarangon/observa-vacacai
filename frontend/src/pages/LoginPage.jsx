export default function LoginPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Entrar</h1>
        <p>Acesso de moradores, pesquisadores e gestores.</p>
        <form className="stack-form">
          <label>
            E-mail
            <input type="email" placeholder="voce@exemplo.com" />
          </label>
          <label>
            Senha
            <input type="password" placeholder="Digite sua senha" />
          </label>
          <button className="button" type="submit">
            Acessar
          </button>
        </form>
      </div>
    </section>
  );
}
