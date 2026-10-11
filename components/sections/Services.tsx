import { services } from "@/data/services";

export default function Services() {
  return (
    <section id="servicos" className="section">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="caption" data-reveal>O que ela faz</p>
          <h2 className="h2 mt-4" data-reveal>Você escolhe quanto quer delegar.</h2>
          <div className="rule mt-6" aria-hidden="true" />
        </div>
        <ol className="md:col-span-8">
          {services.map((s) => (
            <li key={s.n} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-7 last:border-b md:grid-cols-[5rem_1fr]" data-reveal>
              <span className="font-display text-2xl text-primary md:text-3xl">{s.n}</span>
              <div>
                <h3 className="h3">{s.title}</h3>
                <p className="mt-2 text-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
