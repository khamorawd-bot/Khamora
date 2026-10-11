import { proofs } from "@/data/services";

export default function Proof() {
  return (
    <section aria-label="Experiência" className="border-y border-line bg-surface">
      <ul className="container-x grid grid-cols-3 divide-x divide-line py-8 text-center">
        {proofs.map((p) => (
          <li key={p.label} className="min-w-0 px-2" data-reveal>
            <p className="font-display text-base text-primary sm:text-2xl md:text-5xl">{p.value}</p>
            <p className="caption mt-1 !text-[0.625rem] !text-soft sm:!text-xs">{p.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
