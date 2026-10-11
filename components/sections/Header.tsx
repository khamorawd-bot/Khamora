import { SITE, waLink } from "@/lib/config";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav aria-label="Principal" className="container-x flex items-center justify-between py-5">
        <a href="#topo" className="font-display text-xl tracking-[0.2em] text-primary" aria-label={SITE.name}>SF</a>
        <ul className="hidden items-center gap-8 text-sm uppercase tracking-[0.14em] text-soft md:flex">
          <li><a className="transition hover:text-primary" href="#servicos">Serviços</a></li>
          <li><a className="transition hover:text-primary" href="#galeria">Trabalhos</a></li>
          <li><a className="transition hover:text-primary" href="#sobre">Sobre</a></li>
          <li><a className="transition hover:text-primary" href="#faq">Dúvidas</a></li>
        </ul>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-[44px] !px-5 text-sm">WhatsApp</a>
      </nav>
    </header>
  );
}
