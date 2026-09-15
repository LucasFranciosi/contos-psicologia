(() => {
  const slides = [...document.querySelectorAll(".slide")];
  let index = Math.max(0, slides.findIndex(slide => slide.classList.contains("active")));
  if (!slides.length) return;
  function show(nextIndex) { slides.forEach((slide, current) => { slide.classList.toggle("active", current === nextIndex); slide.classList.toggle("is-leaving", current < nextIndex); }); index = nextIndex; }
  function next() { if (index < slides.length - 1) show(index + 1); else window.parent.postMessage({ type: "presentation-finished" }, "*"); }
  function previous() { if (index > 0) show(index - 1); else window.parent.postMessage({ type: "presentation-previous" }, "*"); }
  window.addEventListener("keydown", event => { if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); next(); } if (event.key === "ArrowLeft") { event.preventDefault(); previous(); } });
  document.addEventListener("click", event => { if (event.target.closest("a,button,input")) return; event.clientX > window.innerWidth / 2 ? next() : previous(); });
})();
