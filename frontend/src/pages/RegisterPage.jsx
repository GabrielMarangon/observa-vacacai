export default function RegisterPage() {
  return (
    <section className="page narrow-page">
      <div className="form-card">
        <h1>Criar conta</h1>
        <p>Cadastro inicial para uso autenticado da plataforma.</p>
        <form className="stack-form">
          <label>
            Nome completo
            <input type="text" placeholder="Seu nome" />
          </label>
          <label>
            E-mail
            <input type="email" placeholder="voce@exemplo.com" />
          </label>
          <label>
            Bairro
            <input type="text" placeholder="Seu bairro" />
          </label>
          <label>
            Senha
            <input type="password" placeholder="Defina uma senha" />
          </label>
          <button className="button" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </section>
  );
}
