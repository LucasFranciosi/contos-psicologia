const Auth = (() => {
  const SESSION_KEY = "contos-psicologia-session";
  // Altere estas credenciais para mudar o acesso ao portal.
  const credentials = { usuario: "admin", senha: "contos123" };

  function login(usuario, senha) {
    if (usuario === credentials.usuario && senha === credentials.senha) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ usuario, authenticated: true }));
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
