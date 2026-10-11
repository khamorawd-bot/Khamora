import { faqs } from "@/data/services";

export default function Faq() {
  return (
    <section id="faq" className="section bg-surface">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="caption" data-reveal>Dúvidas</p>
          <h2 className="h2 mt-4" data-reveal>O que mais perguntam.</h2>
        </div>
        <div className="md:col-span-8">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-line py-5 last:border-b" data-reveal>
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-display text-xl md:text-2xl">
                {f.q}
                <span className="text-primary transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
