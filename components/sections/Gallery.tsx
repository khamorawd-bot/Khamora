import { gallery } from "@/data/services";

export default function Gallery() {
  return (
    <section id="galeria" className="section">
      <div className="container-x">
        <p className="caption" data-reveal>Trabalhos</p>
        <h2 className="h2 mt-4" data-reveal>Eventos que viraram memória.</h2>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {gallery.map((g) => (
            <figure key={g.file} className={g.span} data-reveal>
              {/* IMAGEM: {g.file} */}
              <div className={`${g.ratio} flex h-full w-full items-end border border-line bg-surface p-3`} role="img" aria-label={`Espaço reservado: ${g.alt}`}>
                <span className="text-xs uppercase tracking-[0.18em] text-soft">{g.alt}</span>
              </div>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-sm text-soft">[PREENCHER] As fotos reais dos eventos entram aqui.</p>
      </div>
    </section>
  );
}
