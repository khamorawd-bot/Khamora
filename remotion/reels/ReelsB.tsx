import { interpolate, useCurrentFrame } from "remotion";
import { B, C, CtaWord, FONT, O, Pop, Reel, Rise, Signature, SfxEvent, T, Browser, Clock, PersonIcon, Timeline, timeline, useBeat, useCount, useSp, f } from "./kit";

const useGF = (tl: Timeline) => {
  const frame = useCurrentFrame();
  const i = useBeat();
  return f(tl.S[i]) + frame;
};

// =====================================================================
// 6. Do zero ao ar em 60 segundos
// =====================================================================
// Reel 6 sincronizado com a narração (~35 s)
export const tl6 = timeline([2.2, 1.1, 2.1, 2.0, 2.1, 2.0, 2.0, 2.3, 2.1, 2.1, 1.2, 2.5, 1.9, 2.5, 1.5, 1.6, 1.6, 2.15]);

const DayCounter: React.FC = () => {
  const g = useGF(tl6);
  const day = Math.round(interpolate(g, [f(tl6.S[2]), f(tl6.S[13])], [1, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.card, border: `3px solid ${C.orange}`, borderRadius: 50, padding: "12px 44px" }}>
        <T size={52} color={C.orange} style={{ letterSpacing: 6 }}>DIA {day}</T>
      </div>
    </div>
  );
};
const Stage: React.FC<{ n: number; word: string }> = ({ n, word }) => (
  <>
    <Pop now><T size={260} color={C.orange} style={{ letterSpacing: -8 }}>{n}</T></Pop>
    <Rise now from={120}><T size={word.length > 10 ? 92 : 130}>{word}</T></Rise>
    <DayCounter />
  </>
);
const MiniBubble: React.FC<{ text: string; me?: boolean; delay: number }> = ({ text, me, delay }) => {
  const s = useSp(delay, 12, 170);
  return (
    <div style={{ alignSelf: me ? "flex-end" : "flex-start", background: me ? C.orange : C.card2, color: me ? C.bg : C.white, borderRadius: 32, padding: "24px 34px", fontFamily: FONT, fontWeight: 600, fontSize: 52, maxWidth: 680, opacity: Math.min(1, s * 4), transform: `scale(${0.7 + 0.3 * s})` }}>{text}</div>
  );
};
const Wire: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = (k: number) => Math.min(1, Math.max(0, (frame - k * 7) / 8));
  return (
    <Browser width={860} height={820}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ opacity: sp(0), height: 160, borderRadius: 20, background: "#D9D4CB" }} />
        <div style={{ opacity: sp(1), display: "flex", gap: 14 }}>{[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 150, borderRadius: 18, background: "#E5DED4" }} />)}</div>
        <div style={{ opacity: sp(2), display: "flex", gap: 14 }}><div style={{ flex: 1, height: 140, borderRadius: 18, background: "#E5DED4" }} /><div style={{ flex: 1.6, height: 140, borderRadius: 18, background: "#D9D4CB" }} /></div>
        <div style={{ opacity: sp(3), height: 90, borderRadius: 45, background: "#C9C3B8" }} />
      </div>
    </Browser>
  );
};
const Code: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [[.5, C.orange], [.8, C.white], [.65, C.mute], [.4, C.orange2], [.9, C.white], [.55, C.mute], [.75, C.orange], [.6, C.white], [.85, C.mute], [.45, C.orange2], [.7, C.white], [.5, C.mute]] as [number, string][];
  const shown = Math.min(rows.length, Math.floor(frame / 3));
  return (
    <div style={{ width: 880, background: "#161616", borderRadius: 30, padding: 40, boxShadow: "0 30px 80px rgba(0,0,0,.45)" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}</div>
      {rows.map(([w, c], k) => (
        <div key={k} style={{ height: 26, borderRadius: 13, background: c, width: `${w * 100}%`, marginLeft: (k % 3) * 36, marginBottom: 18, opacity: k < shown ? 0.9 : 0 }} />
      ))}
    </div>
  );
};
const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = [C.orange, C.orange2, C.white, C.warm, C.green];
  return (
    <>
      {Array.from({ length: 46 }).map((_, k) => {
        const r1 = ((k * 9301 + 49297) % 233280) / 233280, r2 = ((k * 4513 + 7211) % 233280) / 233280;
        const t = Math.max(0, frame - 2) / 30;
        const x = 540 + (r1 - 0.5) * 1100 * Math.min(1, t * 2.2), y = 760 + (r2 - 0.8) * -600 * Math.min(1, t * 3) + t * t * 900 - 100;
        return <div key={k} style={{ position: "absolute", left: x, top: y, width: 22, height: 14, background: cols[k % 5], transform: `rotate(${k * 40 + t * 400}deg)`, opacity: interpolate(t, [0, 1.1], [1, 0], { extrapolateRight: "clamp" }) }} />;
      })}
    </>
  );
};
const Live: React.FC = () => (
  <>
    <Browser width={860} height={820}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: C.orange, borderRadius: 22, padding: 34, height: 180 }}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 50, color: C.bg }}>Seu negócio</div><div style={{ width: "55%", height: 16, background: "rgba(35,35,35,.35)", borderRadius: 8, marginTop: 18 }} /></div>
        <div style={{ display: "flex", gap: 14 }}>{[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 150, borderRadius: 18, background: "#E5DED4" }} />)}</div>
        <div style={{ height: 100, borderRadius: 50, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, color: C.orange }}>Fale no WhatsApp</div></div>
      </div>
    </Browser>
    <Pop delay={4} style={{ marginTop: 50 }}><div style={{ background: C.green, borderRadius: 50, padding: "16px 60px" }}><T size={80} color={C.bg}>NO AR!</T></div></Pop>
    <Confetti />
  </>
);
const Recap: React.FC<{ from?: number; to?: number }> = ({ from = 0, to = 4 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
    {["Conversa.", "Layout.", "Desenvolvimento.", "No ar!"].map((w, k) => (k >= from && k < to ? (
      <Rise key={w} now={k === from} delay={(k - from) * 8} from={90}><T size={104} style={{ textAlign: "left" }}><O>{k + 1}.</O> {w}</T></Rise>
    ) : null))}
  </div>
);
const Cap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Rise now from={80} style={{ marginBottom: 44 }}><T size={74}>{children}</T></Rise>
);

export const Reel6: React.FC = () => {
  const S = tl6.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.5], [S[1], "pop", 0.45],
    [S[2], "pop", 0.4], [S[2] + 0.05, "accel", 0.3], [S[3] + 0.2, "msg", 0.5], [S[4] + 0.2, "msg", 0.5],
    [S[5], "pop", 0.4], [S[6] + 0.2, "click", 0.5], [S[6] + 0.7, "snap", 0.55], [S[7] + 0.3, "click", 0.5], [S[7] + 0.9, "snap", 0.55],
    [S[8], "pop", 0.4], [S[9] + 0.05, "typing", 0.5], [S[10] + 0.05, "typing", 0.45], [S[11] + 0.6, "ding", 0.45],
    [S[12], "pop", 0.4], [S[13] + 0.05, "boom", 0.6], [S[13] + 0.1, "confetti", 0.55], [S[13] + 0.25, "ding", 0.55],
    [S[14], "pop", 0.4], [S[14] + 0.8, "pop", 0.4], [S[15], "pop", 0.4], [S[15] + 0.8, "pop", 0.4],
    [S[16], "pop", 0.45], [S[16] + 0.25, "ding", 0.5], [S[17], "pop", 0.4],
  ];
  return (
    <Reel music="r6" musicVol={0.28} voice="voz6" sfx={sfx}>
      <B tl={tl6} i={0}><Rise now from={240}><T size={118}>Você acha que fazer um site é <O>complicado?</O></T></Rise></B>
      <B tl={tl6} i={1}><Pop now><T size={190} color={C.orange}>Veja.</T></Pop></B>
      <B tl={tl6} i={2}><Stage n={1} word="Conversa." /></B>
      <B tl={tl6} i={3}>
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 20 }}>
          <MiniBubble text="Vamos alinhar o que você precisa." me delay={4} />
        </div>
        <DayCounter />
      </B>
      <B tl={tl6} i={4}>
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 20 }}>
          <MiniBubble text="Vamos alinhar o que você precisa." me delay={0} />
          <MiniBubble text="E como eu posso te ajudar." me delay={8} />
        </div>
        <DayCounter />
      </B>
      <B tl={tl6} i={5}><Stage n={2} word="Layout." /></B>
      <B tl={tl6} i={6}><Cap>Como você quer o site?<br /><O>Cores.</O></Cap><Wire /><DayCounter /></B>
      <B tl={tl6} i={7}><Cap><O>Logos.</O> Fotos.</Cap><Wire /><DayCounter /></B>
      <B tl={tl6} i={8}><Stage n={3} word="Desenvolvimento." /></B>
      <B tl={tl6} i={9}><Cap>Aí entra a <O>mão na massa.</O></Cap><Code /><DayCounter /></B>
      <B tl={tl6} i={10}><Cap>Eu faço o <O>protótipo</O></Cap><Code /><DayCounter /></B>
      <B tl={tl6} i={11}><Cap>e validamos se precisa <O>alterar algo.</O></Cap><Wire /><DayCounter /></B>
      <B tl={tl6} i={12}><Stage n={4} word="No ar!" /></B>
      <B tl={tl6} i={13}><Live /><Rise delay={10} style={{ marginTop: 40 }}><T size={72}>Parabéns, você já tem seu site.</T></Rise></B>
      <B tl={tl6} i={14}><Recap from={0} to={2} /></B>
      <B tl={tl6} i={15}><Recap from={2} to={4} /></B>
      <B tl={tl6} i={16}><CtaWord word="COMEÇAR" /></B>
      <B tl={tl6} i={17}><Rise now from={160}><T size={100}>e eu te mando mais <O>informações.</O></T></Rise><Signature /></B>
    </Reel>
  );
};

// =====================================================================
// 7. 3 mitos sobre site
// =====================================================================
// Reel 7 sincronizado com a narração (~21 s)
export const tl7 = timeline([1.65, 2.55, 2.4, 2.4, 1.5, 1.9, 2.4, 2.1, 2.0, 2.5]);

const Strike: React.FC<{ lines: string[]; p: number; size?: number; color?: string }> = ({ lines, p, size = 110, color = C.white }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    {lines.map((ln, k) => {
      const lp = Math.min(1, Math.max(0, p * lines.length - k));
      return (
        <div key={k} style={{ position: "relative", display: "inline-block" }}>
          <T size={size} color={p > 0 ? C.mute : color}>{ln}</T>
          <div style={{ position: "absolute", left: -12, top: "52%", height: 16, borderRadius: 8, background: C.orange, width: `${lp * 104}%` }} />
        </div>
      );
    })}
  </div>
);
const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.orange }) => (
  <T size={60} color={color} style={{ letterSpacing: 8, marginBottom: 36 }}>{children}</T>
);
const Stamp: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const k = Math.min(1, Math.max(0, (frame - delay) / 7));
  const scale = 2.6 - 1.6 * k * k;
  return (
    <div style={{ marginTop: 60, opacity: k > 0 ? 1 : 0, transform: `rotate(-7deg) scale(${scale})` }}>
      <div style={{ border: `10px solid ${C.green}`, borderRadius: 18, padding: "6px 44px" }}><T size={84} color={C.green} style={{ letterSpacing: 8 }}>VERDADE</T></div>
    </div>
  );
};

const MYTHS: { myth: string[]; truth: string[] }[] = [
  { myth: ["Site é só para", "empresa grande."], truth: ["Serve para qualquer", "negócio e tamanho."] },
  { myth: ["Só ter Instagram", "já basta."], truth: ["Ele não", "é só seu."] },
  { myth: ["É complicado", "ter um site."], truth: ["Fazemos tudo", "por você."] },
];

export const Reel7: React.FC = () => {
  const S = tl7.S;
  const sfx: SfxEvent[] = [[0.02, "boom", 0.5], [0.05, "pop", 0.5]];
  [[1, 2], [3, 4], [7, 8]].forEach(([a, t], q) => {
    const sf = [2.1, 2.2, 1.9][q];
    sfx.push([S[a] + 0.1, "pop", 0.45], [S[a] + sf, "pen", 0.65], [S[t] + 0.15, "stamp", 0.75], [S[t] + 0.2, "pop", 0.4]);
  });
  sfx.push([S[5] + 0.1, "pop", 0.4], [S[6] + 0.1, "pop", 0.4], [S[9], "pop", 0.45], [S[9] + 0.3, "ding", 0.55]);
  const MythA: React.FC<{ q: number; strikeF: number }> = ({ q, strikeF }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, Math.max(0, (frame - strikeF) / 12));
    return (
      <>
        <Rise now from={80}><Label>MITO {q + 1}</Label></Rise>
        <Rise now from={160}><Strike lines={MYTHS[q].myth} p={p} /></Rise>
      </>
    );
  };
  const Truth: React.FC<{ q: number }> = ({ q }) => (
    <>
      <div style={{ opacity: 0.4, marginBottom: 40 }}><Strike lines={MYTHS[q].myth} p={1} size={64} /></div>
      <Rise now from={120}><Label>VERDADE:</Label></Rise>
      <Rise now from={160}><T size={120}>{MYTHS[q].truth[0]} <O>{MYTHS[q].truth[1]}</O></T></Rise>
      <Stamp delay={6} />
    </>
  );
  return (
    <Reel music="r7" musicVol={0.28} voice="voz7" sfx={sfx}>
      <B tl={tl7} i={0}><Rise now from={240}><T size={170}><O>3 mitos</O> sobre site.</T></Rise></B>
      <B tl={tl7} i={1}><MythA q={0} strikeF={f(2.1)} /></B>
      <B tl={tl7} i={2}><Truth q={0} /></B>
      <B tl={tl7} i={3}><MythA q={1} strikeF={f(2.2)} /></B>
      <B tl={tl7} i={4}><Truth q={1} /></B>
      <B tl={tl7} i={5}><Rise now from={160}><T size={124}>O tempo passa.<br /><O>O algoritmo muda.</O></T></Rise></B>
      <B tl={tl7} i={6}><Rise now from={160}><T size={112}>Quem não acompanha <O>perde visibilidade.</O></T></Rise></B>
      <B tl={tl7} i={7}><MythA q={2} strikeF={f(1.9)} /></B>
      <B tl={tl7} i={8}><Truth q={2} /></B>
      <B tl={tl7} i={9}><CtaWord word="MITOS" /><Rise delay={18} style={{ marginTop: 30 }}><T size={54} weight={500}>e eu te mando mais informações.</T></Rise><Signature /></B>
    </Reel>
  );
};

// =====================================================================
// 8. Quanto tempo você perde no WhatsApp
// =====================================================================
// Reel 8 sincronizado com a narração (~21,5 s)
export const tl8 = timeline([2.4, 2.1, 1.6, 1.9, 1.7, 1.5, 1.8, 2.4, 0.9, 2.1, 1.3, 2.05]);

const Ping: React.FC<{ text: string; delay: number; x: number; y: number }> = ({ text, delay, x, y }) => {
  const s = useSp(delay, 12, 170);
  return (
    <div style={{ position: "absolute", left: x, top: y, background: C.card2, borderRadius: 30, padding: "18px 30px", fontFamily: FONT, fontWeight: 600, fontSize: 44, color: C.white, opacity: Math.min(1, s * 4), transform: `scale(${0.6 + 0.4 * s})` }}>{text}</div>
  );
};
const Question: React.FC<{ word: string; pings: string[] }> = ({ word, pings }) => (
  <>
    <Rise now from={140}><T size={200} color={C.orange} style={{ letterSpacing: -4 }}>{word}</T></Rise>
    {pings.map((p, k) => <Ping key={k} text={p} delay={6 + k * 9} x={[70, 330, 120][k]} y={[560, 1220, 1330][k]} />)}
  </>
);
const SpinClock: React.FC<{ speed: number; stopAt?: number }> = ({ speed, stopAt }) => {
  const frame = useCurrentFrame();
  const deg = stopAt === undefined ? frame * speed : frame < stopAt ? frame * speed * (1 - frame / stopAt) * 1.6 : stopAt * speed * 0.5 * 1.6 * 0.5;
  return <Clock minuteDeg={deg} size={520} />;
};
const BigCount: React.FC<{ to: number; unit: string }> = ({ to, unit }) => {
  const n = useCount(to, 2, 34);
  return <T size={250} color={C.orange} style={{ letterSpacing: -8 }}>{n}<span style={{ fontSize: 100, color: C.white, letterSpacing: 0 }}> {unit}</span></T>;
};

export const Reel8: React.FC = () => {
  const S = tl8.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.5], [0.3, "msg", 0.4], [0.8, "msg", 0.4], [1.3, "msg", 0.4],
    [S[1] + 0.1, "msg", 0.45], [S[1] + 0.5, "msg", 0.45],
    [S[2] + 0.1, "msg", 0.45], [S[2] + 0.4, "msg", 0.45], [S[3] + 0.1, "msg", 0.45], [S[3] + 0.4, "msg", 0.45], [S[4] + 0.1, "msg", 0.45], [S[4] + 0.4, "msg", 0.45],
    [S[5], "count", 0.35], [S[6], "pop", 0.45], [S[7], "boom", 0.45], [S[7] + 0.1, "count", 0.35], [S[8], "pop", 0.4],
    [S[9] + 0.2, "relief", 0.6], [S[10], "pop", 0.4], [S[11], "pop", 0.45], [S[11] + 0.3, "ding", 0.5],
  ];
  for (let t = S[6]; t < S[9]; t += 0.5) sfx.push([t, Math.round(t / 0.5) % 2 ? "tick" : "tock", 0.35]);
  return (
    <Reel music="r8" musicVol={0.28} voice="voz8" sfx={sfx}>
      <B tl={tl8} i={0}><Rise now from={240}><T size={118}>Você responde a mesma pergunta <O>20 vezes</O> por dia?</T></Rise></B>
      <B tl={tl8} i={1}><Rise now from={120}><T size={104}>O cliente chega e <O>sempre pergunta:</O></T></Rise></B>
      <B tl={tl8} i={2}><Question word="Preço?" pings={["Quanto custa?", "Qual o valor?", "Tem desconto?"]} /></B>
      <B tl={tl8} i={3}><Question word="Endereço?" pings={["Onde fica?", "Qual o endereço?", "Tem estacionamento?"]} /></B>
      <B tl={tl8} i={4}><Question word="Horário?" pings={["Abre sábado?", "Até que horas?", "Abre feriado?"]} /></B>
      <B tl={tl8} i={5}><BigCount to={20} unit="perguntas" /></B>
      <B tl={tl8} i={6}><SpinClock speed={14} /><Rise now from={80} style={{ marginTop: 50 }}><T size={150}><O>×</O> 2 min</T></Rise></B>
      <B tl={tl8} i={7}><SpinClock speed={34} /><div style={{ marginTop: 40 }}><BigCount to={40} unit="minutos" /></div></B>
      <B tl={tl8} i={8}><Pop now><T size={170}>por <O>dia.</O></T></Pop></B>
      <B tl={tl8} i={9}>
        <SpinClock speed={34} stopAt={22} />
        <Rise delay={12} style={{ marginTop: 50 }}><T size={116}>Um site responde <O>por você</O></T></Rise>
      </B>
      <B tl={tl8} i={10}><Rise now from={160}><T size={118}>e economiza o seu <O>tempo.</O></T></Rise></B>
      <B tl={tl8} i={11}><CtaWord word="TEMPO" /><Rise delay={18} style={{ marginTop: 30 }}><T size={54} weight={500}>e eu te apresento uma solução.</T></Rise><Signature /></B>
    </Reel>
  );
};

// =====================================================================
// 9. Cartão de visita vs site
// =====================================================================
// Reel 9 sincronizado com a narração (~14,5 s)
export const tl9 = timeline([1.6, 0.95, 2.05, 2.1, 1.5, 1.5, 2.0, 1.0, 1.85]);

const BizCard: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ width: 620 * scale, height: 360 * scale, background: C.warm, borderRadius: 24 * scale, padding: 40 * scale, position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,.4)" }}>
    <div style={{ width: 70 * scale, height: 70 * scale, borderRadius: 18 * scale, background: C.orange }} />
    <div style={{ width: "55%", height: 24 * scale, borderRadius: 12 * scale, background: C.bg, marginTop: 40 * scale }} />
    <div style={{ width: "38%", height: 16 * scale, borderRadius: 8 * scale, background: "#B8B0A3", marginTop: 20 * scale }} />
    <div style={{ width: "46%", height: 16 * scale, borderRadius: 8 * scale, background: "#B8B0A3", marginTop: 14 * scale }} />
  </div>
);
const MiniSite: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <Browser width={620 * scale} height={430 * scale}>
    <div style={{ background: C.orange, borderRadius: 16, height: 110 * scale }} />
    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>{[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 90 * scale, borderRadius: 12, background: "#E5DED4" }} />)}</div>
  </Browser>
);
const Crowd: React.FC<{ n: number; target: [number, number]; start?: number }> = ({ n, target, start = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, k) => {
        const ang = (k / n) * Math.PI * 2 + 0.4, R = 620 + (k % 3) * 80;
        const sx = target[0] + Math.cos(ang) * R, sy = target[1] + Math.sin(ang) * R * 0.9;
        const pr = Math.min(1, Math.max(0, (frame - start - k * 3) / 26));
        const e = 1 - Math.pow(1 - pr, 3);
        return <div key={k} style={{ position: "absolute", left: sx + (target[0] - sx) * e - 45, top: sy + (target[1] - sy) * e - 45, opacity: pr > 0 ? 1 : 0, transform: `scale(${1 - 0.35 * e})` }}><PersonIcon size={90} /></div>;
      })}
    </>
  );
};
const Ring: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1].map((k) => {
        const p = ((frame + k * 15) % 30) / 30;
        return <div key={k} style={{ position: "absolute", width: 600, height: 600, borderRadius: 300, border: `6px solid ${C.orange}`, opacity: 1 - p, transform: `scale(${0.6 + p * 1.2})` }} />;
      })}
    </>
  );
};

export const Reel9: React.FC = () => {
  const S = tl9.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.5], [0.2, "paper", 0.4],
    [S[1], "paper", 0.5], [S[2] + 0.1, "pop2", 0.4],
    [S[3], "swipe", 0.35], [S[3] + 0.3, "magnet", 0.45], [S[3] + 0.6, "pop3", 0.4], [S[3] + 0.9, "pop2", 0.4], [S[3] + 1.2, "pop3", 0.4],
    [S[4], "pop", 0.4], [S[5], "pop", 0.35],
    [S[6], "magnet", 0.45], [S[6] + 0.5, "pop3", 0.4], [S[6] + 1.0, "pop2", 0.4],
    [S[7], "pop", 0.4], [S[8], "pop", 0.45], [S[8] + 0.3, "ding", 0.5],
  ];
  return (
    <Reel music="r9" musicVol={0.28} voice="voz9" sfx={sfx}>
      <B tl={tl9} i={0}>
        <Rise now from={60}><T size={130}>Cartão de visita <O>vs</O> site.</T></Rise>
        <div style={{ display: "flex", gap: 30, marginTop: 120, alignItems: "center" }}><BizCard scale={0.7} /><MiniSite scale={0.7} /></div>
      </B>
      <B tl={tl9} i={1}><Rise now from={-300}><BizCard /></Rise><Rise delay={8} style={{ marginTop: 50 }}><T size={104}>Cartão de <O>visita:</O></T></Rise></B>
      <B tl={tl9} i={2}>
        <Rise now from={100}><T size={100}>só atinge quem você encontra <O>pessoalmente.</O></T></Rise>
        <Rise delay={14} style={{ marginTop: 60 }}><PersonIcon size={130} color={C.mute} /></Rise>
      </B>
      <B tl={tl9} i={3}>
        <Rise now from={200}><T size={112}><O>Site:</O> serve para quem procura <O>você.</O></T></Rise>
        <Crowd n={9} target={[540, 1260]} start={10} />
      </B>
      <B tl={tl9} i={4}><Rise now from={120}><T size={150}>Um <O>espera</O></T></Rise><div style={{ marginTop: 50, opacity: 0.6 }}><BizCard scale={0.6} /></div></B>
      <B tl={tl9} i={5}><Rise now from={120}><T size={104}>de forma <O>passiva.</O></T></Rise><div style={{ marginTop: 50, opacity: 0.5 }}><BizCard scale={0.6} /></div></B>
      <B tl={tl9} i={6}><Rise now from={120}><T size={110}>O outro atrai de forma <O>ativa.</O></T></Rise><div style={{ marginTop: 170, position: "relative" }}><Ring /><MiniSite scale={0.7} /></div></B>
      <B tl={tl9} i={7}><Pop now><T size={130}>Agora me <O>responde:</O></T></Pop></B>
      <B tl={tl9} i={8}>
        <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <T size={50} color={C.mute}>Cartão</T><BizCard scale={0.7} /><PersonIcon size={90} color={C.mute} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <T size={50} color={C.orange}>Site</T><MiniSite scale={0.7} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: 420, justifyContent: "center" }}>{Array.from({ length: 8 }).map((_, k) => <Pop key={k} delay={8 + k * 3}><PersonIcon size={80} /></Pop>)}</div>
          </div>
        </div>
        <Rise delay={6} style={{ marginTop: 50 }}><T size={80}>Qual deles trabalha <O>por você?</O></T></Rise>
      </B>
    </Reel>
  );
};

// =====================================================================
// 10. Antes e depois de um negócio local
// =====================================================================
// Reel 10 sincronizado com a narração (~24,4 s)
export const tl10 = timeline([1.8, 1.4, 1.1, 1.9, 1.8, 2.2, 1.4, 2.3, 2.1, 2.2, 1.7, 1.8, 2.7]);

const Badge: React.FC = () => (
  <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ border: `3px solid ${C.orange}`, borderRadius: 40, padding: "8px 34px" }}><T size={36} color={C.orange} weight={600} style={{ letterSpacing: 4 }}>EXEMPLO ILUSTRATIVO</T></div>
  </div>
);
const Shop: React.FC<{ color?: string; size?: number }> = ({ color = C.orange, size = 380 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M24 70 L40 30 H160 L176 70 Z" fill={color} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M${24 + k * 38} 70 q19 22 38 0`} fill={k % 2 ? C.warm : color} stroke={color} strokeWidth="2" />)}
    <rect x="36" y="82" width="128" height="94" fill={color} opacity="0.9" />
    <rect x="84" y="112" width="34" height="64" rx="4" fill={C.bg} />
    <rect x="48" y="96" width="28" height="28" rx="4" fill={C.bg} />
    <rect x="126" y="96" width="28" height="28" rx="4" fill={C.bg} />
  </svg>
);
const Bars: React.FC<{ heights: number[]; max?: number; label?: string }> = ({ heights, max = 560, label }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: max + 20 }}>
        {heights.map((h, k) => {
          const p = Math.min(1, Math.max(0, (frame - k * 4) / 18));
          return <div key={k} style={{ width: 96, height: h * max * (1 - Math.pow(1 - p, 3)), borderRadius: 16, background: k === heights.length - 1 ? C.orange : C.orange2, opacity: 0.55 + 0.45 * (k / heights.length) }} />;
        })}
      </div>
      {label && <T size={56} color={C.mute}>{label}</T>}
    </div>
  );
};
const Morph: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [18, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", width: 700, height: 520, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", opacity: 1 - k, transform: `scale(${1 - 0.3 * k})` }}><Shop /></div>
      <div style={{ position: "absolute", opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}><Browser width={640} height={480}><div style={{ background: C.orange, borderRadius: 16, height: 140 }} /><div style={{ display: "flex", gap: 10, marginTop: 14 }}>{[0, 1, 2].map((q) => <div key={q} style={{ flex: 1, height: 120, borderRadius: 12, background: "#E5DED4" }} />)}</div></Browser></div>
    </div>
  );
};
const Orders: React.FC = () => {
  const n = useCount(5, 4, 20);
  return <T size={300} color={C.orange} style={{ letterSpacing: -10 }}>{n}</T>;
};

export const Reel10: React.FC = () => {
  const S = tl10.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.5], [S[1], "swipe", 0.35], [S[2], "pop", 0.45], [S[2] + 0.2, "pop2", 0.4],
    [S[3], "pop", 0.4], [S[4] + 0.2, "pop2", 0.35], [S[4] + 0.7, "pop2", 0.35],
    [S[5], "whoosh", 0.35], [S[5] + 0.7, "snap", 0.55], [S[6], "pop", 0.45], [S[7], "pop", 0.4],
    [S[8] + 0.05, "riser", 0.45], [S[9] + 0.8, "register", 0.55], [S[9] + 0.85, "ding", 0.45],
    [S[10], "pop", 0.4], [S[11], "pop", 0.4], [S[12], "pop", 0.45], [S[12] + 0.3, "ding", 0.55],
  ];
  return (
    <Reel music="r10" musicVol={0.28} voice="voz10" sfx={sfx}>
      <B tl={tl10} i={0}><Rise now from={240}><T size={124}><O>Antes e depois</O> de um negócio local.</T></Rise><Badge /></B>
      <B tl={tl10} i={1}><Shop color="#6A6563" size={340} /><Rise now from={120} style={{ marginTop: 30 }}><T size={120} color={C.mute}>Antes: chegava em média</T></Rise><Badge /></B>
      <B tl={tl10} i={2}><Orders /><T size={64} color={C.white}>pedidos por semana</T><Badge /></B>
      <B tl={tl10} i={3}><Rise now from={160}><T size={120}>Todos por <O>indicação.</O></T></Rise><Rise delay={12} style={{ marginTop: 30 }}><T size={64} color={C.mute}>Orgânico.</T></Rise><Badge /></B>
      <B tl={tl10} i={4}><Rise now from={120}><T size={112}>Sempre os <O>mesmos clientes.</O></T></Rise><div style={{ marginTop: 50 }}><Bars heights={[0.12, 0.14, 0.12, 0.15, 0.13]} max={240} /></div><Badge /></B>
      <B tl={tl10} i={5}><Morph /><Rise now from={120} style={{ marginTop: 30 }}><T size={100}>Mesmo negócio. Agora <O>com site.</O></T></Rise><Badge /></B>
      <B tl={tl10} i={6}><Rise now from={200}><T size={170}><O>Depois:</O></T></Rise><Badge /></B>
      <B tl={tl10} i={7}><Rise now from={160}><T size={112}>O <O>Google</O> traz clientes novos todos os dias.</T></Rise><Badge /></B>
      <B tl={tl10} i={8}><Rise now from={100}><T size={90} style={{ marginBottom: 40 }}>Os pedidos <O>aumentam</O></T></Rise><Bars heights={[0.14, 0.25, 0.4, 0.55]} /><Badge /></B>
      <B tl={tl10} i={9}><Rise now from={100}><T size={90} style={{ marginBottom: 40 }}>e o negócio <O>cresce.</O></T></Rise><Bars heights={[0.14, 0.25, 0.4, 0.6, 0.8, 1]} /><Badge /></B>
      <B tl={tl10} i={10}><Rise now from={160}><T size={120}>O site trabalha <O>por você.</O></T></Rise><Badge /></B>
      <B tl={tl10} i={11}><Pop now><T size={112}><O>Exemplo</O> ilustrativo do crescimento.</T></Pop><Badge /></B>
      <B tl={tl10} i={12}><CtaWord word="QUERO" lead="Quer isso para o seu negócio? Comente" /><Signature /></B>
    </Reel>
  );
};

export const RB: Record<string, { tl: Timeline; C: React.FC; music: string }> = {
  r6: { tl: tl6, C: Reel6, music: "build" },
  r7: { tl: tl7, C: Reel7, music: "hiphop" },
  r8: { tl: tl8, C: Reel8, music: "tick" },
  r9: { tl: tl9, C: Reel9, music: "corp" },
  r10: { tl: tl10, C: Reel10, music: "inspire" },
};
