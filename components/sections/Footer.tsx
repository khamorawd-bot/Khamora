import { SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-x flex flex-col gap-4 text-sm text-soft md:flex-row md:items-center md:justify-between">
        <p><span className="font-display text-lg text-primary">{SITE.name}</span> · {SITE.tagline}</p>
        <p>{SITE.address}</p>
        <a className="min-h-[44px] py-2 transition hover:text-primary" href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram {SITE.instagramHandle}</a>
      </div>
    </footer>
  );
}
