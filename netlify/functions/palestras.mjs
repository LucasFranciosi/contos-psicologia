import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";
import { authenticated, unauthorized } from "./_shared/auth.mjs";

const store = () => getStore({ name: "contos-psicologia", consistency: "strong" });
const key = id => `palestras/${id}.json`;
const valid = value => value && typeof value === "object" && typeof value.titulo === "string" && Array.isArray(value.apresentacoes) && value.apresentacoes.length === 4;

export default async request => {
  if (!authenticated(request)) return unauthorized();
  const url = new URL(request.url); const id = url.pathname.split("/").pop();
  if (request.method === "GET") {
    if (id !== "palestras") { const lecture = await store().get(key(id), { type: "json" }); return lecture ? Response.json(lecture) : Response.json({ error: "Palestra não encontrada." }, { status: 404 }); }
    const { blobs } = await store().list({ prefix: "palestras/" });
    const lectures = await Promise.all(blobs.map(blob => store().get(blob.key, { type: "json" })));
    return Response.json(lectures.filter(Boolean).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")));
  }
  if (request.method === "POST") {
    const value = await request.json();
    if (!valid(value)) return Response.json({ error: "Dados da palestra são inválidos." }, { status: 400 });
    const lecture = { ...value, id: value.id || `p-${randomUUID()}`, createdAt: value.createdAt || new Date().toISOString(), criadoLocalmente: false };
    if (await store().get(key(lecture.id))) return Response.json({ error: "Esta palestra já foi enviada." }, { status: 409 });
    await store().setJSON(key(lecture.id), lecture);
    return Response.json(lecture, { status: 201 });
  }
  return new Response("Método não permitido", { status: 405 });
};
export const config = { path: ["/api/palestras", "/api/palestras/:id"] };
