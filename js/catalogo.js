const Catalogo = (() => {
  const DB = "contos-psicologia"; const STORE = "palestras"; const DRAFT = "contos-psicologia-draft";
  let db; let cache = [];
  function open() { return new Promise((resolve, reject) => { const request = indexedDB.open(DB, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" }); request.onsuccess = () => { db = request.result; resolve(); }; request.onerror = () => reject(request.error); }); }
  function records() { return new Promise((resolve, reject) => { const request = db.transaction(STORE).objectStore(STORE).getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
  function put(value) { return new Promise((resolve, reject) => { const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(value); request.onsuccess = resolve; request.onerror = () => reject(request.error); }); }
  function defaults() { return typeof palestras === "undefined" ? [] : palestras; }
  async function load() { if (!db) await open(); cache = await records(); return [...defaults(), ...cache]; }
  function all() { return [...defaults(), ...cache]; }
  async function save(value) { if (!db) await open(); await put(value); cache.push(value); }
  function draft(value) { if (value === undefined) { try { return JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch { return null; } } localStorage.setItem(DRAFT, JSON.stringify(value)); }
  function clearDraft() { localStorage.removeItem(DRAFT); }
  function id() { return `local-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`; }
  function image(file, url) { if (url?.trim()) return Promise.resolve(url.trim()); if (!file) return Promise.resolve(""); return new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }); }
  return { load, all, save, draft, clearDraft, id, image };
})();
