(() => {
  const sections = [...document.querySelectorAll(".story section")];
  const nav = document.querySelector(".story-nav");
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }), { threshold: .16 });
  document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));
  const visuals = [...document.querySelectorAll(".visual-node")];
  visuals.forEach(media => {
    media.addEventListener("pointermove", event => { const rect = media.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; media.style.transform = `perspective(900px) translate3d(0,var(--drift),0) rotateY(${x * 4}deg) rotateX(${y * -4}deg)`; });
    media.addEventListener("pointerleave", () => { media.style.transform = ""; });
  });
  function integrateVisuals() { visuals.forEach((media, index) => { const rect = media.getBoundingClientRect(); const progress = Math.max(-1, Math.min(1, (window.innerHeight * .55 - (rect.top + rect.height / 2)) / window.innerHeight)); media.style.setProperty("--drift", `${progress * (index % 2 ? 26 : -26)}px`); }); }
  window.addEventListener("scroll", integrateVisuals, { passive: true }); integrateVisuals();
  sections.forEach((section, index) => { const button = document.createElement("button"); button.setAttribute("aria-label", `Ir para a seção ${index + 1}`); button.addEventListener("click", () => section.scrollIntoView({ behavior: "smooth" })); nav.append(button); });
  const navButtons = [...nav.children];
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { const index = sections.indexOf(entry.target); navButtons.forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index)); } }), { threshold: .5 });
  sections.forEach(section => sectionObserver.observe(section));
  window.addEventListener("keydown", event => { if (event.key !== "ArrowDown" && event.key !== "ArrowRight" && event.key !== "ArrowUp" && event.key !== "ArrowLeft") return; event.preventDefault(); const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1; const current = sections.reduce((best, section, index) => Math.abs(section.getBoundingClientRect().top) < Math.abs(sections[best].getBoundingClientRect().top) ? index : best, 0); const target = current + direction; if (target >= 0 && target < sections.length) sections[target].scrollIntoView({ behavior: "smooth" }); else if (target >= sections.length) window.parent.postMessage({ type: "presentation-finished" }, "*"); else window.parent.postMessage({ type: "presentation-previous" }, "*"); });
})();
