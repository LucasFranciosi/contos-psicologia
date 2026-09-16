const Auth = (() => {
  const SESSION_KEY = "contos-psicologia-session";
  // Altere estas credenciais para mudar o acesso ao portal.
  const credentials = { usuario: "Socorro.Franciosi", senha: "gubilu" };

  function login(usuario, senha) {
    const normalizedUser = String(usuario || "").trim().toLocaleLowerCase("pt-BR");
    const configuredUser = credentials.usuario.toLocaleLowerCase("pt-BR");
    if (normalizedUser === configuredUser && senha === credentials.senha) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ usuario: credentials.usuario, authenticated: true }));
      return true;
    }
    return false;
  }
  function loggedIn() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY))?.authenticated === true; }
    catch { return false; }
  }
  function logout() { sessionStorage.removeItem(SESSION_KEY); }
  return { login, loggedIn, logout };
})();
