const Auth = (() => {
  let active = false; let checked = false;
  async function request(path, options = {}) { return fetch(path, { ...options, credentials: "same-origin", headers: { "Content-Type": "application/json", ...(options.headers || {}) } }); }
  async function ensureSession() { if (checked) return active; try { active = (await request("/api/auth/session")).ok; } catch { active = false; } checked = true; return active; }
  async function login(usuario, senha) { const response = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ usuario, senha }) }); active = response.ok; checked = true; return active; }
  async function logout() { try { await request("/api/auth/logout", { method: "POST" }); } finally { active = false; checked = true; } }
  function loggedIn() { return active; }
  return { ensureSession, login, logout, loggedIn };
})();
