import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import LeadBoard from "./LeadBoard";
import type { Lead } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/admin/login");

  // Validação server-side: precisa estar na tabela admins.
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!admin) {
    return (
      <main className="container-x section">
        <p>Este usuário não tem acesso ao painel.</p>
        <form action={signOut}><button className="btn btn-ghost mt-4">Sair</button></form>
      </main>
    );
  }

  const { data } = await supabase
    .from("leads")
    .select("id,name,phone,subject,event_date,message,status,quote_value,notes,created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <main className="container-x py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="h2 text-primary">Leads e orçamentos</h1>
        <form action={signOut}><button className="btn btn-ghost !min-h-[44px]">Sair</button></form>
      </header>
      <LeadBoard leads={(data ?? []) as Lead[]} />
    </main>
  );
}
