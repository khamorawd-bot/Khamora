import { createContext, useContext, useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
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

export const PRECO26_FRAMES = 1380; // 46 s: acompanha a narração

const FPS = 30;
const f = (sec: number) => Math.round(sec * FPS);
const SceneStart = createContext(0);

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

// entradas de 180–320 ms (≈ 8 quadros a 30 fps), sem efeito elástico.
// `at` = segundo ABSOLUTO do vídeo em que o item entra (alinhado à narração)
const Reveal: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const start = useContext(SceneStart);
  const t = interpolate(frame - (f(at) - start), [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 28}px)`, ...style }}>{children}</div>;
};

// Cena entre dois instantes da narração (segundos absolutos)
const Scene: React.FC<{ from: number; to: number; fade?: boolean; children: React.ReactNode }> = ({
  from,
  to,
  fade = true,
  children,
}) => (
  <Sequence from={f(from)} durationInFrames={f(to) - f(from)}>
    <SceneStart.Provider value={f(from)}>
      <SceneBody dur={f(to) - f(from)} fade={fade}>{children}</SceneBody>
    </SceneStart.Provider>
  </Sequence>
);

const SceneBody: React.FC<{ dur: number; fade: boolean; children: React.ReactNode }> = ({ dur, fade, children }) => {
  const frame = useCurrentFrame();
  const out = fade ? interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" }) : 1;
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

// ---- Linha do tempo da narração (segundos), medida no áudio ----
const TL = {
  hook: [0, 3.2],
  prom: [3.2, 5.7],
  p1: [5.7, 11.6],
  p2: [11.6, 15.4],
  p3: [15.4, 22.5],
  conta: [22.5, 32.4],
  apl: [32.4, 40.1],
  cta: [40.1, 46.0],
} as const;
const CTA_FROM = f(TL.cta[0]);

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

const StepScene: React.FC<{
  n: number;
  range: readonly [number, number];
  title: string;
  text: string;
  example: string;
  at: { label: number; title: number; text: number; example: number };
}> = ({ n, range, title, text, example, at }) => (
  <Scene from={range[0]} to={range[1]}>
    <Reveal at={at.label}><Label>Passo {n} de 3</Label></Reveal>
    <Reveal at={at.title}><T size={104}>{title}</T></Reveal>
    <Reveal at={at.text} style={{ marginTop: 36 }}>
      <T size={46} weight={400} style={{ lineHeight: 1.4, letterSpacing: 0, maxWidth: 820 }}>{text}</T>
    </Reveal>
    <Reveal at={at.example} style={{ marginTop: 72 }}>
      <T size={150} color={C.orange} style={{ letterSpacing: -3 }}>{example}</T>
      <T size={34} weight={500} color={C.orangeText} style={{ marginTop: 8, letterSpacing: 0 }}>valor de exemplo</T>
    </Reveal>
  </Scene>
);

const Row: React.FC<{ label: string; value: string; at: number }> = ({ label, value, at }) => (
  <Reveal at={at} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", marginBottom: 22 }}>
    <T size={60} weight={500} style={{ letterSpacing: 0 }}>{label}</T>
    <T size={72}>{value}</T>
  </Reveal>
);

const CountUp: React.FC = () => {
  const frame = useCurrentFrame();
  const start = useContext(SceneStart);
  const count = interpolate(frame, [f(27.9) - start, f(29.3) - start], [0, HORA], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <T size={230} color={C.orange} style={{ letterSpacing: -6 }}>{brl(Math.round(count))}</T>;
};

// ---- Efeitos sonoros: sintetizados localmente (scripts/make_sfx.py) ----
const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.3 }) => (
  <Sequence from={f(at)} durationInFrames={f(1.6)} layout="none">
    <Audio src={staticFile(`remotion/sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

const SFX: [number, string, number?][] = [
  // gancho
  [0.05, "pop"], [0.55, "pop"], [1.5, "pop", 0.4],
  // promessa
  [3.15, "whoosh", 0.22], [3.45, "pop", 0.4],
  // passo 1
  [5.65, "whoosh", 0.22], [5.9, "pop"], [6.95, "pop"], [9.5, "number", 0.3],
  // passo 2
  [11.55, "whoosh", 0.22], [11.9, "pop"], [13.05, "pop"], [14.2, "number", 0.3],
  // passo 3
  [15.4, "whoosh", 0.22], [15.7, "pop"], [17.0, "pop"], [20.4, "pop"], [21.0, "number", 0.3],
  // a conta
  [22.45, "whoosh", 0.22], [22.8, "pop"], [24.45, "pop"], [25.8, "pop"], [27.5, "swipe", 0.25],
  [27.9, "count", 0.3], [29.3, "ding", 0.4], [30.35, "pop"],
  // aplicação
  [32.4, "whoosh", 0.22], [32.65, "pop"], [33.7, "pop"], [34.8, "number", 0.3], [35.0, "ding", 0.3], [36.5, "pop", 0.4], [38.8, "pop", 0.25],
  // chamada final
  [40.05, "whoosh", 0.25], [40.45, "pop"], [41.3, "pop"], [42.65, "thud", 0.5], [42.7, "pop", 0.4], [44.1, "pop", 0.3], [44.55, "pop"],
];

export const Preco26: React.FC = () => {
  useDmSans();
  const frame = useCurrentFrame();
  const showSig = frame < CTA_FROM - 8;
  return (
    <AbsoluteFill>
      <Background />
      {showSig && <Signature />}

      <Scene from={TL.hook[0]} to={TL.hook[1]}>
        <Reveal at={0}><T size={100}>Você cobra barato</T></Reveal>
        <Reveal at={0.5}><T size={100}>porque não sabe</T></Reveal>
        <Reveal at={1.5}><T size={136} color={C.orange} style={{ marginTop: 12 }}>o seu custo?</T></Reveal>
      </Scene>

      <Scene from={TL.prom[0]} to={TL.prom[1]}>
        <Reveal at={3.38}><T size={64} weight={500} style={{ letterSpacing: 0 }}>Faça esta conta em</T></Reveal>
        <Reveal at={3.9}><T size={180} color={C.orange} style={{ letterSpacing: -4 }}>3 passos</T></Reveal>
      </Scene>

      <StepScene
        n={1}
        range={TL.p1}
        title="Custo fixo do mês"
        text="Tudo que você paga mesmo sem vender: internet, programas, impostos, energia."
        example={brl(EX.fixo)}
        at={{ label: 5.85, title: 6.9, text: 7.7, example: 9.5 }}
      />
      <StepScene
        n={2}
        range={TL.p2}
        title="Quanto você quer tirar"
        text="O salário que você deseja receber por mês."
        example={brl(EX.salario)}
        at={{ label: 11.84, title: 13.05, text: 13.7, example: 14.2 }}
      />
      <StepScene
        n={3}
        range={TL.p3}
        title="Horas produtivas"
        text="Não são as 160 do mês: tem reunião, orçamento e divulgação."
        example={`${EX.horas} h`}
        at={{ label: 15.66, title: 17.0, text: 20.4, example: 21.0 }}
      />

      <Scene from={TL.conta[0]} to={TL.conta[1]}>
        <Row label="Custo fixo" value={brl(EX.fixo)} at={22.8} />
        <Row label="+ Salário" value={brl(EX.salario)} at={24.45} />
        <Row label="÷ Horas" value={`${EX.horas} h`} at={25.8} />
        <Reveal at={27.5} style={{ width: "100%", height: 6, background: C.dark, margin: "18px 0 44px", borderRadius: 3 }}>
          <div />
        </Reveal>
        <Reveal at={27.8}>
          <CountUp />
          <T size={64} weight={600}>por hora</T>
        </Reveal>
        <Reveal at={30.35} style={{ marginTop: 40 }}>
          <T size={46} weight={400} style={{ letterSpacing: 0 }}>Esse é o seu valor mínimo.</T>
        </Reveal>
      </Scene>

      <Scene from={TL.apl[0]} to={TL.apl[1]}>
        <Reveal at={32.65}><T size={64} weight={500} style={{ letterSpacing: 0 }}>Projeto de {EX.projeto} horas</T></Reveal>
        <Reveal at={33.7} style={{ marginTop: 24 }}>
          <T size={96} weight={500}>{EX.projeto} × {brl(HORA)}</T>
        </Reveal>
        <Reveal at={34.8}>
          <T size={190} color={C.orange} style={{ letterSpacing: -5 }}>{brl(EX.projeto * HORA)}</T>
        </Reveal>
        <Reveal at={36.5} style={{ marginTop: 52 }}>
          <T size={68} style={{ maxWidth: 880 }}>Cobrou menos que isso? Você está pagando para trabalhar.</T>
        </Reveal>
        <Reveal at={38.8} style={{ marginTop: 36 }}>
          <T size={38} weight={400} style={{ letterSpacing: 0 }}>Some impostos e margem de lucro ao valor final.</T>
        </Reveal>
      </Scene>

      <Scene from={TL.cta[0]} to={TL.cta[1]} fade={false}>
        <Reveal at={40.45}><T size={104} color={C.white}>Quer o guia completo?</T></Reveal>
        <Reveal at={41.3} style={{ marginTop: 28 }}>
          <T size={48} weight={400} color={C.white} style={{ letterSpacing: 0, opacity: 0.85 }}>Como precificar seu serviço</T>
        </Reveal>
        <Reveal at={42.65} style={{ marginTop: 64 }}>
          <div style={{ background: C.orange, borderRadius: 28, padding: "26px 56px", width: "fit-content" }}>
            <T size={34} weight={600} color={C.dark} style={{ letterSpacing: 2 }}>CÓDIGO</T>
            <T size={132} color={C.dark} style={{ letterSpacing: -2 }}>PRECO26</T>
          </div>
        </Reveal>
        <Reveal at={44.1} style={{ marginTop: 40 }}>
          <T size={56} weight={600} color={C.white} style={{ letterSpacing: 0 }}>no link da bio</T>
        </Reveal>
        <Reveal at={44.55} style={{ marginTop: 100 }}>
          <T size={30} weight={500} color={C.white} style={{ letterSpacing: 1, opacity: 0.7, marginBottom: 20 }}>DESENVOLVIDO POR</T>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Img src={staticFile("remotion/brand/simbolo-laranja.png")} style={{ height: 76 }} />
            <Img src={staticFile("remotion/brand/wordmark-branco.png")} style={{ height: 66 }} />
          </div>
          <T size={34} weight={500} color={C.white} style={{ letterSpacing: 0, marginTop: 20, opacity: 0.85 }}>khamora.com.br</T>
        </Reveal>
      </Scene>

      {/* narração + efeitos */}
      <Audio src={staticFile("remotion/audio/voz.mp3")} volume={1} />
      {SFX.map(([at, name, v], i) => (
        <Sfx key={i} at={at} name={name} volume={v} />
      ))}
    </AbsoluteFill>
  );
};
