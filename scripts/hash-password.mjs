// Uso: node scripts/hash-password.mjs "SENHA"  -> imprime o hash para inserir na tabela admins
import { webcrypto as crypto } from "node:crypto";
const password = process.argv[2];
if (!password || password.length < 12) { console.error("Informe uma senha com 12+ caracteres."); process.exit(1); }
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256);
console.log(`pbkdf2$100000$${hex(salt)}$${hex(bits)}`);
