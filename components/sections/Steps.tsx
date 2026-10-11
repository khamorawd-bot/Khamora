import { steps } from "@/data/services";

export default function Steps() {
  return (
    <section className="section bg-surface">
      <div className="container-x">
        <p className="caption" data-reveal>Como funciona</p>
        <h2 className="h2 mt-4 max-w-xl" data-reveal>Quatro passos até o dia que você sonhou.</h2>
        <ol className="relative mt-12 space-y-8 border-l border-primary/40 pl-8 md:grid md:grid-cols-4 md:gap-8 md:space-y-0 md:border-l-0 md:border-t md:pl-0 md:pt-10">
          {steps.map((s, i) => (
            <li key={s.title} className="relative" data-reveal>
              <span className="absolute -left-[39px] top-1 h-3 w-3 rounded-full bg-primary md:-top-[46px] md:left-0" aria-hidden="true" />
              <p className="caption">Passo {i + 1}</p>
              <h3 className="h3 mt-2">{s.title}</h3>
              <p className="mt-2 text-base text-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
