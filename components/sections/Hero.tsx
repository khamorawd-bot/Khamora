import { waLink } from "@/lib/config";

export default function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-28 md:pt-36">
      <div className="container-x grid items-center gap-10 pb-16 md:grid-cols-12 md:pb-28">
        <div className="md:col-span-7">
          <p className="caption" data-reveal>Cerimonial e assessoria · Mogi Guaçu e região</p>
          <h1 className="h1 mt-5" data-reveal>O seu grande dia, sem você correr atrás de nada.</h1>
          <p className="mt-6 max-w-xl text-soft" data-reveal>
            Casamentos e festas de 15 anos com quem tem mais de 10 anos cuidando de cada detalhe.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-reveal>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn">Pedir orçamento no WhatsApp</a>
            <a href="#galeria" className="btn btn-ghost">Ver trabalhos</a>
          </div>
        </div>
        <div className="order-first md:order-none md:col-span-5" data-reveal>
          {/* IMAGEM: hero.jpg (4:5) — retrato real da Silvana */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm border border-line bg-surface md:max-w-none" role="img" aria-label="Espaço reservado para o retrato da Silvana">
            <span className="absolute -bottom-3 -right-3 h-full w-full border border-primary/50" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center font-script text-6xl text-primary/40" aria-hidden="true">SF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
