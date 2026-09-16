const Catalogo = (() => {
  const DB = "contos-psicologia"; const STORE = "palestras"; const DRAFT = "contos-psicologia-draft";
  let db; let cache = []; let remote = [];
  function open() { return new Promise((resolve, reject) => { const request = indexedDB.open(DB, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" }); request.onsuccess = () => { db = request.result; resolve(); }; request.onerror = () => reject(request.error); }); }
  function records() { return new Promise((resolve, reject) => { const request = db.transaction(STORE).objectStore(STORE).getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
  function put(value) { return new Promise((resolve, reject) => { const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(value); request.onsuccess = resolve; request.onerror = () => reject(request.error); }); }
  function remove(id) { return new Promise((resolve, reject) => { const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id); request.onsuccess = resolve; request.onerror = () => reject(request.error); }); }
  const defaults = () => typeof palestras === "undefined" ? [] : palestras;
  async function api(path, options = {}) { const response = await fetch(path, { ...options, credentials: "same-origin" }); if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Não foi possível salvar agora."); return response.status === 204 ? null : response.json(); }
  async function load() { if (!db) await open(); cache = await records(); remote = await api("/api/palestras"); const sent = new Set(remote.map(item => item.id)); return [...defaults(), ...remote, ...cache.filter(item => !sent.has(item.id))]; }
  async function upload(dataUrl) { if (!dataUrl.startsWith("data:image/")) return dataUrl; const blob = await (await fetch(dataUrl)).blob(); const form = new FormData(); form.append("image", blob, "imagem"); return (await api("/api/assets", { method: "POST", body: form })).url; }
  async function uploadImages(value) { if (Array.isArray(value)) return Promise.all(value.map(uploadImages)); if (!value || typeof value !== "object") return typeof value === "string" ? upload(value) : value; return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await uploadImages(item)]))); }
  async function save(value) { const uploaded = await uploadImages(value); const stored = await api("/api/palestras", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(uploaded) }); remote = [stored, ...remote]; return stored; }
  async function migrate() { if (!db) await open(); const existing = await records(); let completed = 0; for (const lecture of existing) { try { await save(lecture); await remove(lecture.id); completed++; } catch (error) { if (!String(error.message).includes("já foi enviada")) throw error; await remove(lecture.id); completed++; } } cache = await records(); return completed; }
  function localCount() { return cache.length; }
  function draft(value) { if (value === undefined) { try { return JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch { return null; } } localStorage.setItem(DRAFT, JSON.stringify(value)); }
  function clearDraft() { localStorage.removeItem(DRAFT); }
  function id() { return `p-${crypto.randomUUID()}`; }
  function image(file, url) { if (url?.trim()) return Promise.resolve(url.trim()); if (!file) return Promise.resolve(""); return new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }); }
  return { load, save, migrate, localCount, draft, clearDraft, id, image };
})();
