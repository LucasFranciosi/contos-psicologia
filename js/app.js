const app = document.getElementById("app");
let selectedPalestra = null;
const safe = value => String(value || "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);

function header() {
  return `<header class="site-header"><a class="wordmark" href="#home">Contos <em>&amp;</em> Psicologia</a><button id="logout" class="logout">Sair</button></header>`;
}
function attachHeader() {
  document.getElementById("logout")?.addEventListener("click", () => { Auth.logout(); location.hash = "#login"; render(); });
}
function loginScreen() {
  app.innerHTML = `<section class="login-page"><div class="login-card"><p class="eyebrow">Bem-vindo</p><h1>Contos <span>&amp;</span><br>Psicologia</h1><p class="intro">Um espaço para olhar, escutar e compartilhar.</p><form id="login-form"><label>Usuário<input name="usuario" autocomplete="username" required autofocus></label><label>Senha<input name="senha" type="password" autocomplete="current-password" required></label><p id="login-error" class="form-error" hidden>Usuário ou senha não conferem.</p><button class="primary" type="submit">Entrar</button></form></div></section>`;
  document.getElementById("login-form").addEventListener("submit", event => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    if (Auth.login(form.get("usuario"), form.get("senha"))) { location.hash = "#home"; render(); }
    else document.getElementById("login-error").hidden = false;
  });
}
function home() {
  app.innerHTML = `${header()}<main class="catalog"><section class="catalog-intro"><p class="eyebrow">Acervo de encontros</p><h1>Palestras para<br><i>estar presente.</i></h1><p>Escolha uma coleção para iniciar a apresentação.</p></section><section class="lecture-grid">${palestras.map(p => `<article class="lecture-card"><div class="cover ${p.capa ? "with-image" : ""}" ${p.capa ? `style="background-image:url('${safe(p.capa)}')"` : ""}><span>${safe(p.subtitulo)}</span><strong>${safe(p.mensagem)}</strong></div><div class="lecture-copy"><p class="eyebrow">${p.apresentacoes.length} ${p.apresentacoes.length === 1 ? "apresentação" : "apresentações"}</p><h2>${safe(p.titulo)}</h2><p>${safe(p.descricao)}</p><button class="primary open-lecture" data-id="${safe(p.id)}">Abrir palestra <span>→</span></button></div></article>`).join("")}</section></main>`;
  attachHeader(); document.querySelectorAll(".open-lecture").forEach(btn => btn.addEventListener("click", () => { selectedPalestra = palestras.find(p => p.id === btn.dataset.id); selectedPalestra.apresentacoes.length === 1 ? openPlayer(0) : lectureDetail(); }));
}
function lectureDetail() {
  const p = selectedPalestra;
  app.innerHTML = `${header()}<main class="detail"><button id="back-home" class="back">← Todas as palestras</button><div class="detail-heading"><p class="eyebrow">${safe(p.subtitulo)}</p><h1>${safe(p.titulo)}</h1><p>${safe(p.descricao)}</p></div><section class="presentation-list"><p class="eyebrow">Apresentações</p>${p.apresentacoes.map((item, index) => `<button class="presentation-choice" data-index="${index}"><span class="choice-number">${String(index + 1).padStart(2, "0")}</span><span><strong>${safe(item.titulo.replace(/^\d+\s*—\s*/, ""))}</strong><small>${safe(item.descricao || "")}</small></span><span class="choice-arrow">→</span></button>`).join("")}</section></main>`;
  attachHeader(); document.getElementById("back-home").addEventListener("click", home); document.querySelectorAll(".presentation-choice").forEach(btn => btn.addEventListener("click", () => openPlayer(Number(btn.dataset.index))));
}
function openPlayer(index) { Player.open(selectedPalestra, index, app, lectureDetail); }
function render() { if (!Auth.loggedIn()) return loginScreen(); if (location.hash.startsWith("#palestra")) return lectureDetail(); home(); }
window.addEventListener("hashchange", render); render();
