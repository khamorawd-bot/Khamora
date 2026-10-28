import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { B, C, Card, CtaWord, FONT, O, Pop, Reel, Rise, Shake, Signature, SfxEvent, T, f, timeline, useBeat, useCount, useSp, Browser, HouseIcon } from "./kit";

// =====================================================================
// 1. Quanto custa um site?
// =====================================================================
export const tl1 = timeline([2, 2, 2, 2, 2, 2, 2, 2, 2]);
const brl = (n: number) => n.toLocaleString("pt-BR");

const Tier: React.FC<{ name: string; a: number; b?: number; plus?: boolean }> = ({ name, a, b, plus }) => {
  const ca = useCount(a, 6, 28);
  const cb = useCount(b ?? 0, 6, 28);
  return (
    <>
      <Rise delay={0}><T size={64} color={C.orange} style={{ letterSpacing: 8 }}>{name}</T></Rise>
      <Rise delay={3} style={{ marginTop: 30 }}><T size={170} style={{ letterSpacing: -5 }}>R$ {brl(ca)}{plus ? "+" : ""}</T></Rise>
      {b !== undefined && (
        <Rise delay={6} style={{ marginTop: 6 }}><T size={110} weight={600} color={C.orange2}>a R$ {brl(cb)}</T></Rise>
      )}
    </>
  );
};
const Desc: React.FC<{ tier: string; children: React.ReactNode }> = ({ tier, children }) => (
  <>
    <Rise delay={0}><T size={56} color={C.orange} style={{ letterSpacing: 8 }}>{tier}</T></Rise>
    <Rise delay={3} style={{ marginTop: 40 }}><T size={112}>{children}</T></Rise>
  </>
);

export const Reel1: React.FC = () => {
  const S = tl1.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.6],
    [S[1], "whoosh", 0.4], [S[1] + 0.2, "count", 0.35], [S[2] + 0.1, "pop", 0.5],
    [S[3], "whoosh", 0.4], [S[3] + 0.2, "count", 0.35], [S[4] + 0.1, "pop", 0.5],
    [S[5], "whoosh", 0.4], [S[5] + 0.2, "count", 0.35], [S[6] + 0.1, "pop", 0.5],
    [S[7], "swipe", 0.4], [S[7] + 0.25, "thud", 0.6], [S[8], "pop", 0.5], [S[8] + 0.3, "ding", 0.6],
  ];
  return (
    <Reel music="r1" sfx={sfx}>
      <B tl={tl1} i={0}>
        <Rise now from={260}><T size={150}>Quanto custa um <O>site?</O></T></Rise>
      </B>
      <B tl={tl1} i={1}><Tier name="SIMPLES" a={800} b={2000} /></B>
      <B tl={tl1} i={2}><Desc tier="SIMPLES">Cartão de visita <O>online.</O></Desc></B>
      <B tl={tl1} i={3}><Tier name="MÉDIO" a={2000} b={5000} /></B>
      <B tl={tl1} i={4}><Desc tier="MÉDIO">Páginas, <O>WhatsApp,</O> Google.</Desc></B>
      <B tl={tl1} i={5}><Tier name="COMPLETO" a={5000} plus /></B>
      <B tl={tl1} i={6}><Desc tier="COMPLETO">Vende <O>sozinho.</O></Desc></B>
      <B tl={tl1} i={7}><CtaWord word="PREÇO" /></B>
      <B tl={tl1} i={8}>
        <Rise><T size={100}>e eu mando a <O>tabela.</O></T></Rise>
        <Signature />
      </B>
    </Reel>
  );
};

// =====================================================================
// 2. Procure seu negócio no Google
// =====================================================================
export const tl2 = timeline([2, 2, 2, 2, 2, 2, 2, 2, 2.5]);

const SearchBar: React.FC<{ chars?: number; text: string; pulse?: boolean; width?: number }> = ({ chars, text, pulse, width = 900 }) => {
  const frame = useCurrentFrame();
  const n = chars ?? text.length;
  const shown = text.slice(0, Math.max(0, Math.min(text.length, n)));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const s = pulse ? 1 + 0.03 * Math.sin(frame / 3) : 1;
  return (
    <div style={{ width, height: 120, borderRadius: 60, background: C.warm, display: "flex", alignItems: "center", padding: "0 44px", gap: 24, transform: `scale(${s})` }}>
      <svg width="52" height="52" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke={C.bg} strokeWidth="2.6" /><line x1="15" y1="15" x2="21" y2="21" stroke={C.bg} strokeWidth="2.6" strokeLinecap="round" /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 48, color: C.bg }}>{shown}<span style={{ opacity: caret ? 1 : 0 }}>|</span></div>
    </div>
  );
};

const TypeBar: React.FC<{ start: number; dur: number; pulse?: boolean; width?: number }> = ({ start, dur, pulse, width }) => {
  const text = "padaria perto de mim";
  const n = useCount(text.length, start, dur);
  return <SearchBar text={text} chars={n} pulse={pulse} width={width} />;
};

const ResultCard: React.FC<{ delay: number; w?: number; children: React.ReactNode; bad?: boolean; style?: React.CSSProperties }> = ({ delay, w = 420, children, bad, style }) => {
  const s = useSp(delay, 9, 120);
  return (
    <div style={{ width: w, opacity: Math.min(1, s * 3), transform: `translateY(${(1 - s) * -220}px)`, background: bad ? "#34302F" : C.warm, borderRadius: 28, padding: 28, ...style }}>{children}</div>
  );
};
const Line: React.FC<{ w: string; h?: number; c?: string }> = ({ w, h = 20, c = "#CFCBC3" }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: c, marginBottom: 14 }} />;

const Columns: React.FC<{ focus?: "left" | "right" | "both"; drop?: boolean; offset?: number }> = ({ focus = "both", drop = true, offset = 0 }) => {
  const dl = drop ? 6 : -60;
  const ml = focus === "right" ? 0.35 : 1, mr = focus === "left" ? 0.35 : 1;
  return (
    <div style={{ display: "flex", gap: 36, alignItems: "flex-start", width: 940, justifyContent: "center" }}>
      <div style={{ opacity: ml, width: 430 }}>
        <T size={50} color={C.mute} style={{ marginBottom: 24 }}>Sem site</T>
        <ResultCard delay={dl + offset} bad>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: "#5A5654" }} />
            <Line w="60%" h={22} c="#6A6563" />
          </div>
          <Line w="85%" c="#5A5654" />
          <Line w="55%" c="#5A5654" />
        </ResultCard>
      </div>
      <div style={{ opacity: mr, width: 430 }}>
        <T size={50} color={C.orange} style={{ marginBottom: 24 }}>Com site</T>
        <ResultCard delay={dl + 8 + offset}>
          <Line w="70%" h={24} c={C.bg} />
          <Line w="90%" />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 70, borderRadius: 14, background: k === 0 ? "#F1C9A8" : "#E5DED4" }} />)}
          </div>
        </ResultCard>
        <ResultCard delay={dl + 14 + offset} style={{ marginTop: 18 }}>
          <Line w="50%" c={C.bg} h={22} />
          <div style={{ background: C.orange, borderRadius: 18, height: 64, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.bg }}>WhatsApp</div>
          </div>
        </ResultCard>
      </div>
    </div>
  );
};

export const Reel2: React.FC = () => {
  const S = tl2.S;
  const sfx: SfxEvent[] = [
    [0.02, "typing", 0.45],
    [S[1] + 0.05, "typing", 0.5], [S[1] + 1.65, "click", 0.6],
    [S[2] + 0.15, "swipe", 0.35], [S[2] + 0.45, "error", 0.45], [S[2] + 1.0, "ding", 0.55],
    [S[3], "pop", 0.5], [S[3] + 0.8, "error", 0.35],
    [S[4], "pop", 0.5],
    [S[5], "pop", 0.5], [S[6] + 0.2, "pop2", 0.5], [S[6] + 0.5, "pop2", 0.5], [S[6] + 0.8, "pop2", 0.5], [S[6] + 1.1, "ding", 0.6],
    [S[7], "whoosh", 0.4], [S[8], "pop", 0.5], [S[8] + 0.3, "ding", 0.6],
  ];
  const Chip: React.FC<{ t: string; d: number }> = ({ t, d }) => (
    <Pop delay={d}><div style={{ background: C.orange, borderRadius: 40, padding: "14px 40px" }}><T size={58} color={C.bg}>{t}</T></div></Pop>
  );
  return (
    <Reel music="r2" sfx={sfx}>
      <B tl={tl2} i={0}>
        <Rise now from={60}><T size={130}>Procure seu negócio no <O>Google.</O></T></Rise>
        <div style={{ marginTop: 110 }}><TypeBar start={0} dur={50} /></div>
      </B>
      <B tl={tl2} i={1}>
        <TypeBar start={3} dur={42} pulse width={920} />
        <Rise delay={30} style={{ marginTop: 50 }}><T size={70} color={C.mute}>buscando…</T></Rise>
      </B>
      <B tl={tl2} i={2}>
        <Rise delay={0}><T size={80} style={{ marginBottom: 50 }}>Mesma busca. <O>Dois resultados.</O></T></Rise>
        <Columns />
      </B>
      <B tl={tl2} i={3}>
        <Rise now from={200}><T size={104}><span style={{ color: C.mute }}>Sem site:</span> só um <O>perfil perdido.</O></T></Rise>
      </B>
      <B tl={tl2} i={4}>
        <Shake at={20}><Columns focus="left" drop={false} /></Shake>
        <Rise delay={6} style={{ marginTop: 60 }}><T size={64} color={C.mute}>Ninguém sabe se está aberto.</T></Rise>
      </B>
      <B tl={tl2} i={5}>
        <Rise now from={200}><T size={104}><O>Com site:</O> horário, fotos, botão do WhatsApp.</T></Rise>
      </B>
      <B tl={tl2} i={6}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>
          <Chip t="Horário" d={6} /><Chip t="Fotos" d={16} /><Chip t="Botão do WhatsApp" d={26} />
        </div>
      </B>
      <B tl={tl2} i={7}>
        <Rise now from={200}><T size={130}>Quem aparece melhor, <O>vende.</O></T></Rise>
      </B>
      <B tl={tl2} i={8}><CtaWord word="SITE" /><Signature /></B>
    </Reel>
  );
};

// =====================================================================
// 3. Instagram não é seu
// =====================================================================
export const tl3 = timeline([2, 2, 1.5, 2, 1.5, 2, 1.5, 2, 2, 2.5]);

const NotifInner: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ width: 960, display: "flex", alignItems: "center", gap: 28, background: C.card, borderRadius: 36, padding: "34px 40px", border: "2px solid rgba(255,255,255,0.1)" }}>
    <div style={{ width: 96, height: 96, borderRadius: 26, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="56" height="56" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0z" fill={C.bg} /></svg>
    </div>
    <div>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, color: C.mute }}>Notificação · agora</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 58, color: C.white, lineHeight: 1.12 }}>{text}</div>
    </div>
  </div>
);

// frame global da notificação: queda 0-24, quebra em f(2.0)=60
const Notif: React.FC<{ text: string; offset: number }> = ({ text, offset }) => {
  const frame = useCurrentFrame() + offset;
  const { fps } = { fps: 30 };
  const fall = useSpAt(frame, 0);
  const y = (1 - fall) * -900;
  const br = frame - 60;
  if (br < 0) {
    const shake = frame > 40 ? Math.sin(frame * 2.4) * 5 : 0;
    return <div style={{ transform: `translate(${shake}px, ${y}px)` }}><NotifInner text={text} /></div>;
  }
  const k = Math.min(1, br / 24);
  const e = k * k;
  const clipL = "polygon(0 0, 54% 0, 46% 30%, 56% 60%, 47% 100%, 0 100%)";
  const clipR = "polygon(54% 0, 100% 0, 100% 100%, 47% 100%, 56% 60%, 46% 30%)";
  const fade = interpolate(br, [10, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  void fps;
  return (
    <div style={{ position: "relative", opacity: fade }}>
      <div style={{ clipPath: clipL, transform: `translate(${-120 * e}px, ${700 * e}px) rotate(${-24 * e}deg)` }}><NotifInner text={text} /></div>
      <div style={{ position: "absolute", top: 0, left: 0, clipPath: clipR, transform: `translate(${120 * e}px, ${820 * e}px) rotate(${28 * e}deg)` }}><NotifInner text={text} /></div>
    </div>
  );
};
const useSpAt = (frame: number, delay: number) => {
  const s = Math.max(0, frame - delay) / 24;
  // queda com quique simples
  const x = Math.min(1, s);
  return x < 1 ? 1 - Math.pow(1 - x, 3) + Math.sin(x * Math.PI * 2.2) * (1 - x) * 0.12 : 1;
};

const Risk: React.FC<{ n: number; label: string; msg: string; offset: number }> = ({ n, label, msg, offset }) => (
  <>
    <Rise now from={60}><T size={54} color={C.orange} style={{ letterSpacing: 8, marginBottom: 16 }}>RISCO {n}</T></Rise>
    <Rise now from={60}><T size={96} style={{ marginBottom: 70 }}>{label}</T></Rise>
    <Notif text={msg} offset={offset} />
  </>
);

export const Reel3: React.FC = () => {
  const S = tl3.S;
  const sfx: SfxEvent[] = [
    [0.02, "boom", 0.55],
    [S[1] + 0.1, "vibrate", 0.55], [S[2] + 0.02, "glass", 0.6],
    [S[3] + 0.1, "vibrate", 0.55], [S[4] + 0.02, "glass", 0.6],
    [S[5] + 0.1, "vibrate", 0.55], [S[6] + 0.02, "glass", 0.6],
    [S[7], "swipe", 0.4], [S[7] + 0.35, "door", 0.7],
    [S[8] + 0.1, "snap", 0.6], [S[8] + 0.5, "snap", 0.6], [S[8] + 0.9, "snap", 0.6], [S[8] + 1.2, "relief", 0.6],
    [S[9], "pop", 0.5], [S[9] + 0.25, "ding", 0.6],
  ];
  const HouseBuild: React.FC = () => {
    const a = useSp(0, 12, 140), b = useSp(14, 12, 140), c = useSp(28, 12, 160);
    return (
      <svg width="560" height="560" viewBox="0 0 200 200">
        <g style={{ opacity: Math.min(1, a * 3) }} transform={`translate(0 ${(1 - a) * 90})`}><rect x="34" y="96" width="132" height="80" fill={C.orange} /></g>
        <g style={{ opacity: Math.min(1, b * 3) }} transform={`translate(0 ${(1 - b) * -140})`}><path d="M100 18 L190 100 H10 Z" fill={C.orange2} /></g>
        <g style={{ opacity: Math.min(1, c * 3) }} transform={`translate(100 176) scale(${c}) translate(-100 -176)`}>
          <rect x="82" y="116" width="36" height="60" rx="6" fill={C.bg} /><circle cx="110" cy="148" r="3.5" fill={C.orange} />
        </g>
      </svg>
    );
  };
  return (
    <Reel music="r3" sfx={sfx}>
      <B tl={tl3} i={0}><Rise now from={260}><T size={150}>Seu Instagram <O>não é seu.</O></T></Rise></B>
      <B tl={tl3} i={1}><Risk n={1} label="O algoritmo muda." msg="Seu alcance mudou." offset={0} /></B>
      <B tl={tl3} i={2}><Risk n={1} label="O algoritmo muda." msg="Seu alcance mudou." offset={f(2)} /></B>
      <B tl={tl3} i={3}><Risk n={2} label="A conta pode ser bloqueada." msg="Conta bloqueada." offset={0} /></B>
      <B tl={tl3} i={4}><Risk n={2} label="A conta pode ser bloqueada." msg="Conta bloqueada." offset={f(2)} /></B>
      <B tl={tl3} i={5}><Risk n={3} label="Cliente confia mais em endereço próprio." msg="Cliente: qual o site de vocês?" offset={0} /></B>
      <B tl={tl3} i={6}><Risk n={3} label="Cliente confia mais em endereço próprio." msg="Cliente: qual o site de vocês?" offset={f(2)} /></B>
      <B tl={tl3} i={7}><Rise now from={220}><T size={130}>Ter site é ter <O>sua casa.</O></T></Rise></B>
      <B tl={tl3} i={8}><HouseBuild /></B>
      <B tl={tl3} i={9}>
        <Pop now><HouseIcon size={300} /></Pop>
        <div style={{ height: 30 }} />
        <CtaWord word="CASA" />
      </B>
    </Reel>
  );
};

// =====================================================================
// 4. Só 4 coisas para o primeiro dia
// =====================================================================
export const tl4 = timeline([2, 2, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2, 2.5]);

const Page: React.FC<{ k: number }> = ({ k }) => {
  const frame = useCurrentFrame();
  const drop = (n: number) => {
    const t = n === k ? Math.min(1, frame / 14) : 1;
    return { opacity: n <= k ? 1 : 0, transform: `translateY(${(1 - t) * -400}px) scale(${n === k ? 1 + 0.06 * (1 - t) : 1})` };
  };
  return (
    <Browser width={880} height={900}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ ...drop(1), background: C.orange, borderRadius: 22, padding: "36px 34px", height: 170 }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, color: C.bg }}>Quem você é</div>
          <div style={{ width: "60%", height: 16, background: "rgba(35,35,35,.35)", borderRadius: 8, marginTop: 18 }} />
        </div>
        <div style={{ ...drop(2), display: "flex", gap: 14 }}>
          {[0, 1, 2].map((q) => <div key={q} style={{ flex: 1, background: "#E5DED4", borderRadius: 18, height: 150, padding: 18 }}><div style={{ width: "70%", height: 14, background: "#B8B0A3", borderRadius: 7 }} /></div>)}
        </div>
        <div style={{ ...drop(3), display: "flex", gap: 14 }}>
          <div style={{ flex: 1, height: 130, borderRadius: 18, background: "#F1C9A8" }} />
          <div style={{ flex: 1.6, height: 130, borderRadius: 18, background: "#E5DED4", padding: 20 }}>
            <div style={{ width: "90%", height: 14, background: "#B8B0A3", borderRadius: 7, marginBottom: 12 }} />
            <div style={{ width: "60%", height: 14, background: "#B8B0A3", borderRadius: 7 }} />
          </div>
        </div>
        <div style={{ ...drop(4), background: C.bg, borderRadius: 40, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, color: C.orange }}>Fale no WhatsApp</div>
        </div>
      </div>
    </Browser>
  );
};

const Item: React.FC<{ n: number; label: React.ReactNode }> = ({ n, label }) => (
  <>
    <Pop now><div style={{ width: 190, height: 190, borderRadius: 95, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><T size={130} color={C.bg}>{n}</T></div></Pop>
    <Rise now from={100} style={{ marginTop: 50 }}><T size={120}>{label}</T></Rise>
  </>
);

export const Reel4: React.FC = () => {
  const S = tl4.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.6], [S[1], "whoosh", 0.4],
    [S[2], "pop", 0.5], [S[3] + 0.15, "snap", 0.7],
    [S[4], "pop", 0.5], [S[5] + 0.15, "snap", 0.7],
    [S[6], "pop", 0.5], [S[7] + 0.15, "snap", 0.7],
    [S[8], "pop", 0.5], [S[9] + 0.15, "snap", 0.7],
    [S[10] + 0.2, "ding", 0.7], [S[10] + 0.25, "confetti", 0.5], [S[11], "pop", 0.5], [S[11] + 0.3, "ding", 0.6],
  ];
  const items: [number, React.ReactNode][] = [
    [1, <>Quem <O>você é.</O></>],
    [2, <>O que <O>vende.</O></>],
    [3, <><O>Provas:</O> fotos e depoimentos.</>],
    [4, <>Botão do <O>WhatsApp.</O></>],
  ];
  return (
    <Reel music="r4" sfx={sfx}>
      <B tl={tl4} i={0}><Rise now from={240}><T size={124}>Você não precisa de um site <O>gigante.</O></T></Rise></B>
      <B tl={tl4} i={1}><Rise now from={200}><T size={120}>Só <O>4 coisas</O> para o primeiro dia.</T></Rise></B>
      {items.map(([n, label], q) => (
        <>
          <B key={`a${n}`} tl={tl4} i={2 + q * 2}><Item n={n} label={label} /></B>
          <B key={`b${n}`} tl={tl4} i={3 + q * 2}><Page k={n} /></B>
        </>
      ))}
      <B tl={tl4} i={10}>
        <Pop now><Page k={4} /></Pop>
        <Rise delay={10} style={{ marginTop: 50 }}><T size={100}>Sua página <O>no ar.</O></T></Rise>
      </B>
      <B tl={tl4} i={11}><CtaWord word="4" /><Signature /></B>
    </Reel>
  );
};

// =====================================================================
// 5. Sinais de que é hora de ter site
// =====================================================================
export const tl5 = timeline([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

const Bubble: React.FC<{ text: string; me?: boolean; delay: number; size?: number }> = ({ text, me, delay, size = 56 }) => {
  const s = useSp(delay, 12, 170);
  return (
    <div style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: 700, background: me ? C.orange : C.card2, color: me ? C.bg : C.white, borderRadius: 34, borderBottomLeftRadius: me ? 34 : 8, borderBottomRightRadius: me ? 8 : 34, padding: "26px 36px", fontFamily: FONT, fontWeight: 600, fontSize: size, lineHeight: 1.15, opacity: Math.min(1, s * 4), transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 40}px)`, transformOrigin: me ? "right bottom" : "left bottom" }}>
      {text}
    </div>
  );
};
const Typing: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  return (
    <div style={{ alignSelf: "flex-start", background: C.card2, borderRadius: 34, padding: "26px 36px", display: "flex", gap: 12 }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ width: 18, height: 18, borderRadius: 9, background: C.mute, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - delay) / 5 + k)) }} />)}
    </div>
  );
};
const Chat: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 22 }}>{children}</div>
);
const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Rise now from={80} style={{ marginBottom: 56 }}><T size={78}>{children}</T></Rise>
);
const Photos: React.FC = () => {
  const n = useCount(20, 0, 40);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 14 }}>
        {Array.from({ length: 20 }).map((_, k) => (
          <div key={k} style={{ width: 150, height: 150, borderRadius: 18, background: k % 3 === 0 ? "#F1C9A8" : k % 3 === 1 ? C.card2 : "#E5DED4", opacity: k < n ? 1 : 0.12 }} />
        ))}
      </div>
      <T size={150} color={C.orange} style={{ marginTop: 40 }}>{n} fotos</T>
    </>
  );
};
const Repeat: React.FC = () => (
  <Chat>
    <Bubble text="Qual o endereço?" delay={0} />
    <Bubble text="Qual o endereço?" delay={14} />
    <Bubble text="Qual o endereço?" delay={28} />
    <Rise delay={42} style={{ marginTop: 30 }}><T size={100} color={C.orange}>de novo?</T></Rise>
  </Chat>
);

export const Reel5: React.FC = () => {
  const S = tl5.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.6], [0.4, "msg", 0.5],
    [S[1] + 0.2, "msg", 0.55], [S[2] + 0.1, "pop2", 0.4], [S[2] + 0.5, "pop2", 0.4], [S[2] + 0.9, "pop2", 0.4], [S[2] + 1.35, "womp", 0.5],
    [S[3] + 0.2, "msg", 0.55], [S[4] + 0.1, "msg", 0.5], [S[4] + 0.5, "msg", 0.5], [S[4] + 0.9, "msg", 0.5], [S[4] + 1.35, "womp", 0.5],
    [S[5] + 0.2, "msg", 0.55], [S[6] + 0.4, "msg", 0.5], [S[6] + 1.2, "sigh", 0.5],
    [S[7], "swipe", 0.4], [S[7] + 0.3, "ding", 0.55], [S[8] + 0.2, "pop", 0.5], [S[9], "pop", 0.5], [S[9] + 0.3, "ding", 0.6],
  ];
  return (
    <Reel music="r5" sfx={sfx}>
      <B tl={tl5} i={0}>
        <Rise now from={240}><T size={124}>Se isso acontece, você precisa de um <O>site.</O></T></Rise>
      </B>
      <B tl={tl5} i={1}>
        <Caption>Cliente pede <O>catálogo</O> e você manda 20 fotos.</Caption>
        <Chat><Bubble text="Vocês têm catálogo?" delay={4} /><Typing delay={20} /></Chat>
      </B>
      <B tl={tl5} i={2}><Photos /></B>
      <B tl={tl5} i={3}>
        <Caption>Perguntam o <O>endereço</O> de novo.</Caption>
        <Chat><Bubble text="Qual o endereço?" delay={4} /><Bubble text="Rua das Flores, 120" me delay={22} /></Chat>
      </B>
      <B tl={tl5} i={4}><Repeat /></B>
      <B tl={tl5} i={5}>
        <Caption>“Vocês têm <O>site?</O>”</Caption>
        <Chat><Bubble text="Vocês têm site?" delay={4} /><Typing delay={22} /></Chat>
      </B>
      <B tl={tl5} i={6}>
        <Chat>
          <Bubble text="Vocês têm site?" delay={0} />
          <Bubble text="Ainda não…" me delay={14} />
        </Chat>
        <Rise delay={36} style={{ marginTop: 50 }}><T size={80} color={C.mute}>silêncio.</T></Rise>
      </B>
      <B tl={tl5} i={7}><Rise now from={200}><T size={118}>Tudo isso se resolve com um <O>site.</O></T></Rise></B>
      <B tl={tl5} i={8}><Pop now><T size={130}>Seu cliente quer achar <O>tudo</O> em um lugar só.</T></Pop></B>
      <B tl={tl5} i={9}>
        <Rise now><T size={140}>Marque quem <O>precisa.</O></T></Rise>
        <Signature />
      </B>
    </Reel>
  );
};

export const R: Record<string, { tl: typeof tl1; C: React.FC; music: string }> = {
  r1: { tl: tl1, C: Reel1, music: "lofi" },
  r2: { tl: tl2, C: Reel2, music: "mini" },
  r3: { tl: tl3, C: Reel3, music: "tense" },
  r4: { tl: tl4, C: Reel4, music: "pop" },
  r5: { tl: tl5, C: Reel5, music: "quirk" },
};
void AbsoluteFill; void Easing; void Card; void Browser; void Shake; void useBeat;
