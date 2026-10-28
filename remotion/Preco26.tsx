import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const PRECO26_FRAMES = 1080;

// Identidade oficial Khamora (Direção de Arte + Tipografia, edição 01 / out 2026)
const C = {
  dark: "#232323",
  orange: "#FF6900",
  orangeText: "#A83F00", // laranja para texto pequeno sobre fundo claro
  warm: "#FAF9F6",
  white: "#FFFFFF",
};
const FONT = '"DM Sans", Arial, sans-serif';
const M = 88; // margem lateral (grade de 8 px)

// valores de EXEMPLO: troque aqui
const EX = { fixo: 1500, salario: 4000, horas: 100, projeto: 20 };
const HORA = (EX.fixo + EX.salario) / EX.horas;
const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

const useDmSans = () => {
  const [handle] = useState(() => delayRender("dm-sans"));
  useEffect(() => {
    const weights = [400, 500, 600, 700];
    Promise.all(
      weights.flatMap((w) =>
        ["latin", "latin-ext"].map((s) =>
          new FontFace("DM Sans", `url(${staticFile(`remotion/fonts/dm-sans-${s}-${w}-normal.woff2`)})`, {
            weight: String(w),
          })
            .load()
            .then((f) => document.fonts.add(f)),
        ),
      ),
    )
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle]);
};

// entradas de 180–320 ms (≈ 8 quadros a 30 fps), sem efeito elástico
const Reveal: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 28}px)`, ...style }}>{children}</div>;
};

const Scene: React.FC<{ duration: number; fade?: boolean; children: React.ReactNode }> = ({
  duration,
  fade = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const out = fade ? interpolate(frame, [duration - 8, duration], [1, 0], { extrapolateLeft: "clamp" }) : 1;
  return (
    <AbsoluteFill
      style={{ opacity: out, padding: `0 ${M}px`, justifyContent: "center", alignItems: "flex-start", paddingBottom: 120 }}
    >
      {children}
    </AbsoluteFill>
  );
};

type TProps = { size?: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode };
const T: React.FC<TProps> = ({ size = 96, weight = 700, color = C.dark, style, children }) => (
  <div style={{ fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 1.12, color, letterSpacing: -1, ...style }}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <T size={36} weight={600} color={light ? C.white : C.orangeText} style={{ letterSpacing: 1, marginBottom: 28 }}>
    {children}
  </T>
);

// Espiral inspirada no rabo do camaleão: detalhe sutil, nunca disputa com o título
const Spiral: React.FC<{ dark: number }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const pts: string[] = [];
  for (let i = 0; i <= 260; i++) {
    const a = i * 0.14;
    const r = 6 + a * 11;
    pts.push(`${i === 0 ? "M" : "L"}${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg
      width={900}
      height={900}
      viewBox="-450 -450 900 900"
      style={{ position: "absolute", right: -330, bottom: 120, opacity: 0.2 + 0.1 * dark, transform: `rotate(${frame * 0.12}deg)` }}
    >
      <path d={pts.join(" ")} fill="none" stroke={C.orange} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

const CTA_FROM = 930;

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = interpolate(frame, [CTA_FROM - 8, CTA_FROM], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: C.warm }}>
      <AbsoluteFill style={{ backgroundColor: C.dark, opacity: dark }} />
      <Spiral dark={dark} />
    </AbsoluteFill>
  );
};

// Mesmo logo, mesma posição e escala em toda a sequência
const Signature: React.FC = () => (
  <Img src={staticFile("remotion/brand/simbolo-laranja.png")} style={{ position: "absolute", top: 232, left: M, width: 132 }} />
);

const StepScene: React.FC<{ n: number; title: string; text: string; example: string; duration: number }> = ({
  n,
  title,
  text,
  example,
  duration,
}) => (
  <Scene duration={duration}>
    <Reveal><Label>Passo {n} de 3</Label></Reveal>
    <Reveal delay={5}><T size={104}>{title}</T></Reveal>
    <Reveal delay={14} style={{ marginTop: 36 }}>
      <T size={46} weight={400} style={{ lineHeight: 1.4, letterSpacing: 0, maxWidth: 820 }}>{text}</T>
    </Reveal>
    <Reveal delay={28} style={{ marginTop: 72 }}>
      <T size={150} color={C.orange} style={{ letterSpacing: -3 }}>{example}</T>
      <T size={34} weight={500} color={C.orangeText} style={{ marginTop: 8, letterSpacing: 0 }}>valor de exemplo</T>
    </Reveal>
  </Scene>
);

const Row: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => (
  <Reveal delay={delay} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", marginBottom: 22 }}>
    <T size={60} weight={500} style={{ letterSpacing: 0 }}>{label}</T>
    <T size={72}>{value}</T>
  </Reveal>
);

const Conta: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [95, 150], [0, HORA], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Scene duration={duration}>
      <Row label="Custo fixo" value={brl(EX.fixo)} delay={4} />
      <Row label="+ Salário" value={brl(EX.salario)} delay={24} />
      <Row label="÷ Horas" value={`${EX.horas} h`} delay={50} />
      <Reveal delay={76} style={{ width: "100%", height: 6, background: C.dark, margin: "18px 0 44px", borderRadius: 3 }}>
        <div />
      </Reveal>
      <Reveal delay={90}>
        <T size={230} color={C.orange} style={{ letterSpacing: -6 }}>{brl(Math.round(count))}</T>
        <T size={64} weight={600}>por hora</T>
      </Reveal>
      <Reveal delay={150} style={{ marginTop: 40 }}>
        <T size={46} weight={400} style={{ letterSpacing: 0 }}>Esse é o seu valor mínimo.</T>
      </Reveal>
    </Scene>
  );
};

const Cta: React.FC<{ duration: number }> = ({ duration }) => (
  <Scene duration={duration + 8} fade={false}>
    <Reveal><T size={104} color={C.white}>Quer o guia completo?</T></Reveal>
    <Reveal delay={8} style={{ marginTop: 28 }}>
      <T size={48} weight={400} color={C.white} style={{ letterSpacing: 0, opacity: 0.85 }}>Como precificar seu serviço</T>
    </Reveal>
    <Reveal delay={22} style={{ marginTop: 64 }}>
      <div style={{ background: C.orange, borderRadius: 28, padding: "26px 56px", width: "fit-content" }}>
        <T size={34} weight={600} color={C.dark} style={{ letterSpacing: 2 }}>CÓDIGO</T>
        <T size={132} color={C.dark} style={{ letterSpacing: -2 }}>PRECO26</T>
      </div>
    </Reveal>
    <Reveal delay={36} style={{ marginTop: 40 }}>
      <T size={56} weight={600} color={C.white} style={{ letterSpacing: 0 }}>no link da bio</T>
    </Reveal>
    <Reveal delay={60} style={{ marginTop: 130 }}>
      <T size={30} weight={500} color={C.white} style={{ letterSpacing: 1, opacity: 0.7, marginBottom: 20 }}>DESENVOLVIDO POR</T>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Img src={staticFile("remotion/brand/simbolo-laranja.png")} style={{ height: 76 }} />
        <Img src={staticFile("remotion/brand/wordmark-branco.png")} style={{ height: 66 }} />
      </div>
      <T size={34} weight={500} color={C.white} style={{ letterSpacing: 0, marginTop: 20, opacity: 0.85 }}>khamora.com.br</T>
    </Reveal>
  </Scene>
);

export const Preco26: React.FC = () => {
  useDmSans();
  const T_ = { hook: 100, prom: 60, p1: 130, p2: 130, p3: 150, conta: 210, apl: 150, cta: 150 };
  let at = 0;
  const seq = (d: number) => {
    const from = at;
    at += d;
    return from;
  };
  const frame = useCurrentFrame();
  const showSig = frame < CTA_FROM - 8;
  return (
    <AbsoluteFill>
      <Background />
      {showSig && <Signature />}
      <Sequence from={seq(T_.hook)} durationInFrames={T_.hook}>
        <Scene duration={T_.hook}>
          <Reveal><T size={100}>Você cobra barato</T></Reveal>
          <Reveal delay={8}><T size={100}>porque não sabe</T></Reveal>
          <Reveal delay={16}><T size={136} color={C.orange} style={{ marginTop: 12 }}>o seu custo?</T></Reveal>
        </Scene>
      </Sequence>
      <Sequence from={seq(T_.prom)} durationInFrames={T_.prom}>
        <Scene duration={T_.prom}>
          <Reveal><T size={64} weight={500} style={{ letterSpacing: 0 }}>Faça esta conta em</T></Reveal>
          <Reveal delay={6}><T size={180} color={C.orange} style={{ letterSpacing: -4 }}>3 passos</T></Reveal>
        </Scene>
      </Sequence>
      <Sequence from={seq(T_.p1)} durationInFrames={T_.p1}>
        <StepScene n={1} duration={T_.p1} title="Custo fixo do mês" text="Tudo que você paga mesmo sem vender: internet, programas, impostos, energia." example={brl(EX.fixo)} />
      </Sequence>
      <Sequence from={seq(T_.p2)} durationInFrames={T_.p2}>
        <StepScene n={2} duration={T_.p2} title="Quanto você quer tirar" text="O salário que você deseja receber por mês." example={brl(EX.salario)} />
      </Sequence>
      <Sequence from={seq(T_.p3)} durationInFrames={T_.p3}>
        <StepScene n={3} duration={T_.p3} title="Horas produtivas" text="Não são as 160 do mês: tem reunião, orçamento e divulgação." example={`${EX.horas} h`} />
      </Sequence>
      <Sequence from={seq(T_.conta)} durationInFrames={T_.conta}>
        <Conta duration={T_.conta} />
      </Sequence>
      <Sequence from={seq(T_.apl)} durationInFrames={T_.apl}>
        <Scene duration={T_.apl}>
          <Reveal><T size={64} weight={500} style={{ letterSpacing: 0 }}>Projeto de {EX.projeto} horas</T></Reveal>
          <Reveal delay={12} style={{ marginTop: 24 }}>
            <T size={96} weight={500}>{EX.projeto} × {brl(HORA)}</T>
            <T size={190} color={C.orange} style={{ letterSpacing: -5 }}>{brl(EX.projeto * HORA)}</T>
          </Reveal>
          <Reveal delay={56} style={{ marginTop: 52 }}>
            <T size={68} style={{ maxWidth: 880 }}>Cobrou menos que isso? Você está pagando para trabalhar.</T>
          </Reveal>
          <Reveal delay={92} style={{ marginTop: 36 }}>
            <T size={38} weight={400} style={{ letterSpacing: 0 }}>Some impostos e margem de lucro ao valor final.</T>
          </Reveal>
        </Scene>
      </Sequence>
      <Sequence from={seq(T_.cta)} durationInFrames={T_.cta}>
        <Cta duration={T_.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
