import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const PRECO26_FRAMES = 1080;

const C = { bg: "#0B1512", fg: "#F5F1E8", accent: "#F5C451", mute: "#8FA39A", green: "#3DDC97" };
const FONT = "Inter, Helvetica, Arial, sans-serif";

// valores de EXEMPLO: troque aqui
const EX = { fixo: 1500, salario: 4000, horas: 100, projeto: 20 };
const HORA = (EX.fixo + EX.salario) / EX.horas;
const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

const Reveal: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 150 } });
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * 50}px)`, ...style }}>{children}</div>;
};

const Scene: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [duration - 8, duration], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out, padding: "0 80px", justifyContent: "center", alignItems: "center" }}>
      {children}
    </AbsoluteFill>
  );
};

const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 96,
  color = C.fg,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.08,
      color,
      textAlign: "center",
      letterSpacing: -1,
      ...style,
    }}
  >
    {children}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 48, lineHeight: 1.25, color: C.mute, textAlign: "center", ...style }}>
    {children}
  </div>
);

const Example: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => (
  <Reveal delay={delay} style={{ marginTop: 56 }}>
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 120,
        color: C.accent,
        textAlign: "center",
      }}
    >
      {children}
    </div>
    <div style={{ fontFamily: FONT, fontSize: 34, color: C.mute, textAlign: "center", marginTop: 6 }}>exemplo</div>
  </Reveal>
);

const StepScene: React.FC<{ n: number; title: string; text: string; example: string; duration: number }> = ({
  n,
  title,
  text,
  example,
  duration,
}) => (
  <Scene duration={duration}>
    <Reveal>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: 6,
          color: C.bg,
          background: C.accent,
          borderRadius: 100,
          padding: "10px 36px",
          textAlign: "center",
          margin: "0 auto 48px",
          width: "fit-content",
        }}
      >
        PASSO {n} DE 3
      </div>
    </Reveal>
    <Reveal delay={6}>
      <Big size={92}>{title}</Big>
    </Reveal>
    <Reveal delay={16} style={{ marginTop: 36 }}>
      <Sub>{text}</Sub>
    </Reveal>
    <Example delay={32}>{example}</Example>
  </Scene>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 80;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${30 + drift / 4}% 20%, rgba(61,220,151,0.16), transparent 70%), radial-gradient(900px 900px at 80% ${85 - drift / 4}%, rgba(245,196,81,0.13), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 120, left: 80, right: 80, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.12)" }}>
      <div style={{ width: `${(frame / PRECO26_FRAMES) * 100}%`, height: "100%", borderRadius: 8, background: C.accent }} />
    </div>
  );
};

const Conta: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [95, 150], [0, HORA], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const rows: [string, string, number][] = [
    ["Custo fixo", brl(EX.fixo), 4],
    ["+ Salário", brl(EX.salario), 24],
    ["÷ Horas", `${EX.horas} h`, 50],
  ];
  return (
    <Scene duration={duration}>
      {rows.map(([l, v, d]) => (
        <Reveal key={l} delay={d} style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 28 }}>
          <Big size={64} color={C.mute}>{l}</Big>
          <Big size={64}>{v}</Big>
        </Reveal>
      ))}
      <Reveal delay={80} style={{ width: "100%", height: 6, background: C.fg, borderRadius: 6, margin: "20px 0 40px" }}>
        <div />
      </Reveal>
      <Reveal delay={90}>
        <Big size={170} color={C.green}>{brl(Math.round(count))}</Big>
        <Big size={60} color={C.fg}>por hora</Big>
      </Reveal>
      <Reveal delay={150} style={{ marginTop: 40 }}>
        <Sub>Esse é o seu valor mínimo por hora</Sub>
      </Reveal>
    </Scene>
  );
};

export const Preco26: React.FC = () => {
  const T = { hook: 100, prom: 60, p1: 130, p2: 130, p3: 150, conta: 210, apl: 150, cta: 150 };
  let at = 0;
  const seq = (d: number) => {
    const from = at;
    at += d;
    return from;
  };
  return (
    <AbsoluteFill>
      <Background />
      <Progress />
      <Sequence from={seq(T.hook)} durationInFrames={T.hook}>
        <Scene duration={T.hook}>
          <Reveal><Big size={78}>VOCÊ COBRA BARATO</Big></Reveal>
          <Reveal delay={10}><Big size={78}>PORQUE NÃO SABE</Big></Reveal>
          <Reveal delay={22}><Big size={130} color={C.accent} style={{ marginTop: 14, whiteSpace: "nowrap" }}>O SEU CUSTO?</Big></Reveal>
        </Scene>
      </Sequence>
      <Sequence from={seq(T.prom)} durationInFrames={T.prom}>
        <Scene duration={T.prom}>
          <Reveal><Sub style={{ fontSize: 56 }}>Faça esta conta em</Sub></Reveal>
          <Reveal delay={8}><Big size={150} color={C.green}>3 PASSOS</Big></Reveal>
        </Scene>
      </Sequence>
      <Sequence from={seq(T.p1)} durationInFrames={T.p1}>
        <StepScene n={1} duration={T.p1} title="CUSTO FIXO DO MÊS" text="Tudo que você paga mesmo sem vender: internet, programas, impostos, energia" example={brl(EX.fixo)} />
      </Sequence>
      <Sequence from={seq(T.p2)} durationInFrames={T.p2}>
        <StepScene n={2} duration={T.p2} title="QUANTO VOCÊ QUER TIRAR" text="O salário que você deseja receber por mês" example={brl(EX.salario)} />
      </Sequence>
      <Sequence from={seq(T.p3)} durationInFrames={T.p3}>
        <StepScene n={3} duration={T.p3} title="HORAS PRODUTIVAS" text="Não são as 160 do mês: tem reunião, orçamento e divulgação" example={`${EX.horas} h`} />
      </Sequence>
      <Sequence from={seq(T.conta)} durationInFrames={T.conta}>
        <Conta duration={T.conta} />
      </Sequence>
      <Sequence from={seq(T.apl)} durationInFrames={T.apl}>
        <Scene duration={T.apl}>
          <Reveal><Sub style={{ fontSize: 56 }}>Projeto de {EX.projeto} horas</Sub></Reveal>
          <Reveal delay={14} style={{ marginTop: 30 }}>
            <Big size={88}>{EX.projeto} × {brl(HORA)}</Big>
            <Big size={150} color={C.green}>{brl(EX.projeto * HORA)}</Big>
          </Reveal>
          <Reveal delay={60} style={{ marginTop: 50 }}>
            <Big size={64} color={C.accent}>Cobrou menos que isso? Você paga para trabalhar.</Big>
          </Reveal>
          <Reveal delay={95} style={{ marginTop: 36 }}>
            <Sub style={{ fontSize: 40 }}>Some impostos e margem de lucro ao valor final</Sub>
          </Reveal>
        </Scene>
      </Sequence>
      <Sequence from={seq(T.cta)} durationInFrames={T.cta}>
        <Scene duration={T.cta + 8}>
          <Reveal><Big size={96}>QUER O GUIA COMPLETO?</Big></Reveal>
          <Reveal delay={10} style={{ marginTop: 20 }}><Sub>Como precificar seu serviço</Sub></Reveal>
          <Reveal delay={26} style={{ marginTop: 60 }}>
            <div style={{ background: C.accent, borderRadius: 40, padding: "28px 70px" }}>
              <Big size={40} color={C.bg} style={{ letterSpacing: 4 }}>CÓDIGO</Big>
              <Big size={140} color={C.bg}>PRECO26</Big>
            </div>
          </Reveal>
          <Reveal delay={48} style={{ marginTop: 50 }}><Big size={60} color={C.fg}>no link da bio</Big></Reveal>
        </Scene>
      </Sequence>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4))" }} />
    </AbsoluteFill>
  );
};
