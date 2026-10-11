import { redirect } from "next/navigation";
import { getAdminId } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { signOut } from "./actions";
import LeadBoard from "./LeadBoard";
import type { Lead } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getAdminId())) redirect("/admin/login");

  const { results } = await getDB()
    .prepare("SELECT id,name,phone,subject,event_date,message,status,quote_value,notes,created_at FROM leads ORDER BY created_at DESC LIMIT 500")
    .all<Lead>();

  return (
    <main className="container-x py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="h2 text-primary">Leads e orçamentos</h1>
        <form action={signOut}><button className="btn btn-ghost !min-h-[44px]">Sair</button></form>
      </header>
      <LeadBoard leads={results} />
    </main>
  );
}
