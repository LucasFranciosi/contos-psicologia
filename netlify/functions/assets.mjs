import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";
import { authenticated, unauthorized } from "./_shared/auth.mjs";

const store = () => getStore({ name: "contos-psicologia", consistency: "strong" });
const key = id => `imagens/${id}`;

export default async request => {
  if (!authenticated(request)) return unauthorized();
  const id = new URL(request.url).pathname.split("/").pop();
  if (request.method === "GET") {
    const [image, metadata] = await Promise.all([store().get(key(id), { type: "arrayBuffer" }), store().getMetadata(key(id))]);
    if (!image) return new Response("Imagem não encontrada", { status: 404 });
    return new Response(image, { headers: { "Content-Type": metadata?.contentType || "application/octet-stream", "Cache-Control": "private, max-age=31536000, immutable" } });
  }
  if (request.method === "POST") {
    const form = await request.formData(); const file = form.get("image");
    if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) return Response.json({ error: "Envie uma imagem de até 4 MB." }, { status: 400 });
    const imageId = randomUUID(); await store().set(key(imageId), await file.arrayBuffer(), { metadata: { contentType: file.type } });
    return Response.json({ url: `/api/assets/${imageId}` }, { status: 201 });
  }
  return new Response("Método não permitido", { status: 405 });
};
export const config = { path: ["/api/assets", "/api/assets/:id"] };
