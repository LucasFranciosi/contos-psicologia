import { authenticated, clearSessionCookie, credentialsMatch, sessionCookie } from "./_shared/auth.mjs";

export default async request => {
  const path = new URL(request.url).pathname;
  if (path.endsWith("/session") && request.method === "GET") return authenticated(request) ? Response.json({ authenticated: true }) : Response.json({ authenticated: false }, { status: 401 });
  if (path.endsWith("/logout") && request.method === "POST") return new Response(null, { status: 204, headers: { "Set-Cookie": clearSessionCookie() } });
  if (path.endsWith("/login") && request.method === "POST") {
    const { usuario, senha } = await request.json();
    if (!credentialsMatch(usuario, senha)) return Response.json({ error: "Usuário ou senha não conferem." }, { status: 401 });
    return Response.json({ authenticated: true }, { headers: { "Set-Cookie": sessionCookie(usuario) } });
  }
  return new Response("Método não permitido", { status: 405 });
};
export const config = { path: ["/api/auth/login", "/api/auth/logout", "/api/auth/session"] };
