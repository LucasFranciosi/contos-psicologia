const Player = (() => {
  let palestra = null;
  let current = 0;
  let viewIndex = 0;
  let onExit = null;

  function escape(value) {
    return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  }
  function render(app) {
    const item = palestra.apresentacoes[current];
    const view = item.visualizacoes?.[viewIndex] || item;
    const total = palestra.apresentacoes.length;
    const iframeSrc = view.tipo === "video" ? youtubeEmbed(view.src) : view.src;
    app.innerHTML = `
      <section class="player ${item.visualizacoes ? "has-views" : ""}" aria-label="Player de apresentação">
        <header class="player-bar player-head">
          <div class="player-title">${escape(palestra.titulo)} <span>·</span> ${escape(item.titulo)}</div>
          <div class="player-actions"><button id="fullscreen" class="icon-button" title="Tela cheia (F)">Tela cheia</button><button id="exit-player" class="text-button">Sair</button><button class="brand-button" id="player-back" title="Voltar para a palestra"><img src="./assets/logo-symbol.png" alt="Contos e Psicologia"></button></div>
        </header>
        ${item.visualizacoes ? `<div class="view-switch" role="tablist" aria-label="Modo de visualização">${item.visualizacoes.map((option, index) => `<button class="view-option ${index === viewIndex ? "active" : ""}" data-view="${index}" role="tab" aria-selected="${index === viewIndex}">${escape(option.rotulo)}</button>`).join("")}</div>` : ""}
        <div class="presentation-frame"><iframe id="presentation-iframe" src="${escape(iframeSrc)}" title="${escape(view.rotulo || item.titulo)}" allowfullscreen></iframe></div>
        <footer class="player-bar player-foot">
          <button id="previous-presentation" class="nav-button" ${current === 0 ? "disabled" : ""}>← <span>Anterior</span></button>
          <div class="progress" aria-label="Apresentação ${current + 1} de ${total}">${current + 1} <span>/</span> ${total}</div>
          <button id="next-presentation" class="nav-button" ${current === total - 1 ? "disabled" : ""}><span>Próxima</span> →</button>
        </footer>
      </section>`;
    document.getElementById("player-back").addEventListener("click", leave);
    document.getElementById("exit-player").addEventListener("click", leave);
    document.getElementById("previous-presentation").addEventListener("click", previous);
    document.getElementById("next-presentation").addEventListener("click", next);
    document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);
    document.querySelectorAll(".view-option").forEach(button => button.addEventListener("click", () => { viewIndex = Number(button.dataset.view); render(app); }));
    // Direciona o teclado ao PowerPoint/HTML carregado, sem interferir na
    // navegação interna da apresentação.
    document.getElementById("presentation-iframe").addEventListener("load", event => event.currentTarget.focus());
    setAmbientLevel(item.trilha ?? .012);
  }
  function open(selectedPalestra, index, app, exitCallback) {
    palestra = selectedPalestra; current = index; viewIndex = 0; onExit = exitCallback;
    render(app);
  }
  function next() { if (current < palestra.apresentacoes.length - 1) { current++; viewIndex = 0; render(document.getElementById("app")); } }
  function previous() { if (current > 0) { current--; viewIndex = 0; render(document.getElementById("app")); } }
  function youtubeEmbed(url) {
    try { const parsed = new URL(url); const id = parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : parsed.searchParams.get("v"); return `https://www.youtube-nocookie.com/embed/${id}?rel=0`; }
    catch { return url; }
  }
  let ambient;
  function setAmbientLevel(level) {
    if (!ambient) {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (!AudioEngine) return;
      const context = new AudioEngine();
      const master = context.createGain(); master.gain.value = 0.0001; master.connect(context.destination);
      [174.61, 220, 261.63].forEach((frequency, index) => { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = index === 1 ? "triangle" : "sine"; oscillator.frequency.value = frequency; gain.gain.value = index === 1 ? .14 : .08; oscillator.connect(gain).connect(master); oscillator.start(); });
      ambient = { context, master };
    }
    ambient.context.resume();
    ambient.master.gain.setTargetAtTime(level, ambient.context.currentTime, 1.7);
  }
  function leave() { if (document.fullscreenElement) document.exitFullscreen(); onExit?.(); }
  function toggleFullscreen() { const player = document.querySelector(".player"); if (!document.fullscreenElement) player?.requestFullscreen?.(); else document.exitFullscreen?.(); }
  function keyboard(event) {
    if (!palestra || event.altKey || event.ctrlKey || event.metaKey) return;
    // As setas pertencem ao conteúdo incorporado. Assim, no PowerPoint elas
    // avançam os slides, e em apresentações HTML navegam a própria narrativa.
    // A troca entre apresentações do portal fica restrita aos botões do rodapé.
    if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFullscreen(); }
    if (event.key === "Escape" && !document.fullscreenElement) leave();
  }
  window.addEventListener("keydown", keyboard);
  window.addEventListener("message", event => {
    if (!palestra || event.data?.type === undefined) return;
    // Eventos de limite dos HTMLs são intencionalmente ignorados: o avanço
    // entre etapas é sempre uma decisão manual no player.
  });
  return { open };
})();
