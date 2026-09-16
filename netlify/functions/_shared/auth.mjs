import { createHmac, timingSafeEqual } from "node:crypto";

const HOURS = 8;
const env = name => Netlify.env.get(name);
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const sign = value => createHmac("sha256", env("SESSION_SECRET")).update(value).digest("base64url");
const cookieValue = request => Object.fromEntries((request.headers.get("cookie") || "").split(";").map(part => part.trim().split("=")).filter(([key]) => key)).contos_session;

export function credentialsMatch(username, password) {
  return String(username || "").trim().toLocaleLowerCase("pt-BR") === String(env("PORTAL_USERNAME") || "").trim().toLocaleLowerCase("pt-BR") && password === env("PORTAL_PASSWORD");
}
export function sessionCookie(username) {
  const payload = encode({ username, exp: Date.now() + HOURS * 60 * 60 * 1000 });
  return `contos_session=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${HOURS * 60 * 60}`;
}
export function clearSessionCookie() { return "contos_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"; }
export function authenticated(request) {
  try {
    const token = cookieValue(request); if (!token) return false;
    const [payload, signature] = token.split("."); const expected = sign(payload);
    if (!signature || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch { return false; }
}
export function unauthorized() { return Response.json({ error: "Não autorizado." }, { status: 401 }); }
