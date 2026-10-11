"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(f.get("email")), password: String(f.get("password")),
    });
    setBusy(false);
    if (error) return setError("E-mail ou senha incorretos.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border border-line bg-surface p-8">
        <h1 className="h3 text-primary">Painel da Silvana</h1>
        <label className="block text-sm">E-mail
          <input name="email" type="email" required autoComplete="email" className="field mt-1" />
        </label>
        <label className="block text-sm">Senha
          <input name="password" type="password" required autoComplete="current-password" className="field mt-1" />
        </label>
        {error && <p role="alert" className="text-sm text-accent">{error}</p>}
        <button type="submit" disabled={busy} className="btn w-full">Entrar</button>
      </form>
    </main>
  );
}
