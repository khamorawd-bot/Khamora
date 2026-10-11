import { testimonials } from "@/data/services";

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container-x">
        <p className="caption" data-reveal>Quem confiou</p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="border-l border-primary pl-6" data-reveal>
              <blockquote className="font-display text-2xl leading-snug md:text-3xl">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-soft">{t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
