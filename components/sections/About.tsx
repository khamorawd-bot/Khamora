export default function About() {
  return (
    <section id="sobre" className="section bg-ivory text-ink">
      <div className="container-x grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-5" data-reveal>
          {/* IMAGEM: sobre.jpg (4:5) — retrato real da Silvana */}
          <div className="aspect-[4/5] w-full border border-ink/20 bg-ink/5" role="img" aria-label="Espaço reservado para a foto da Silvana" />
        </div>
        <div className="md:col-span-7">
          <p className="font-script text-4xl text-ink md:text-5xl" data-reveal>Silvana Ferri</p>
          <h2 className="h2 mt-3" data-reveal>Sonhos que se transformam em momentos inesquecíveis.</h2>
          <p className="mt-5 max-w-xl" data-reveal>
            Há mais de 10 anos eu cuido dos bastidores para que a família viva o evento sem preocupação.
            Cada casamento e cada festa de 15 anos tem uma história, e o meu trabalho é fazer ela acontecer do jeito que você imaginou.
          </p>
          <p className="mt-3 text-sm opacity-70" data-reveal>[CONFIRMAR] Texto de apresentação e trajetória da Silvana.</p>
        </div>
      </div>
    </section>
  );
}
