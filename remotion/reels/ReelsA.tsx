import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { B, C, Card, CtaWord, FONT, O, Pop, Reel, Rise, Shake, Signature, SfxEvent, T, f, timeline, useBeat, useCount, useSp, Browser, HouseIcon } from "./kit";

// =====================================================================
// 1. Quanto custa um site?  (sincronizado com a narração: ~44 s)
// =====================================================================
export const tl1 = timeline([2.55, 1.65, 1.8, 1.85, 1.7, 1.85, 1.3, 2.2, 1.3, 1.5, 1.7, 2.7, 2.7, 1.6, 2.5, 2.1, 1.45, 1.15, 1.4, 1.4, 1.6, 2.5, 1.4, 2.1]);
const brl = (n: number) => n.toLocaleString("pt-BR");

const Label1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Rise delay={0}><T size={64} color={C.orange} style={{ letterSpacing: 8 }}>{children}</T></Rise>
);
const Money: React.FC<{ label: string; prefix?: string; to: number; plus?: boolean; size?: number }> = ({ label, prefix = "", to, plus, size = 190 }) => {
  const n = useCount(to, 5, 24);
  return (
    <>
      <Label1>{label}</Label1>
      <Rise delay={3} style={{ marginTop: 34 }}><T size={size} style={{ letterSpacing: -5 }}>{prefix}R$ {brl(n)}{plus ? "+" : ""}</T></Rise>
    </>
  );
};
const Cnt: React.FC<{ to: number; start?: number; dur?: number; prefix?: string; suffix?: string }> = ({ to, start = 4, dur = 26, prefix = "", suffix = "" }) => {
  const n = useCount(to, start, dur);
  return <>{prefix}{brl(n)}{suffix}</>;
};
const Phrase: React.FC<{ tier?: string; children: React.ReactNode; size?: number }> = ({ tier, children, size = 120 }) => (
  <>
    {tier && <Rise delay={0}><T size={52} color={C.orange} style={{ letterSpacing: 8, marginBottom: 36 }}>{tier}</T></Rise>}
    <Rise delay={tier ? 3 : 0} now={!tier}><T size={size}>{children}</T></Rise>
  </>
);
const MapPin: React.FC<{ lift?: boolean }> = ({ lift }) => {
  const frame = useCurrentFrame();
  const y = lift ? interpolate(frame, [0, 40], [90, -40], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  return (
    <div style={{ transform: `translateY(${y}px)` }}>
      <Pop now><svg width="230" height="290" viewBox="0 0 100 126"><path d="M50 4C26 4 10 22 10 44c0 28 40 76 40 76s40-48 40-76C90 22 74 4 50 4z" fill={C.orange} /><circle cx="50" cy="44" r="15" fill={C.bg} /></svg></Pop>
    </div>
  );
};
const Gear: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="220" height="220" viewBox="0 0 100 100" style={{ transform: `rotate(${frame * 6}deg)` }}>
      {Array.from({ length: 8 }).map((_, k) => <rect key={k} x="44" y="4" width="12" height="20" rx="3" fill={C.orange} transform={`rotate(${k * 45} 50 50)`} />)}
      <circle cx="50" cy="50" r="30" fill={C.orange} /><circle cx="50" cy="50" r="12" fill={C.bg} />
    </svg>
  );
};

export const Reel1: React.FC = () => {
  const S = tl1.S;
  const sfx: SfxEvent[] = [
    [0.02, "pop", 0.45],
    [S[1], "whoosh", 0.3], [S[1] + 0.2, "count", 0.3], [S[2] + 0.1, "count", 0.3], [S[3], "pop", 0.4], [S[4], "pop", 0.4], [S[5], "pop", 0.4], [S[6], "pop", 0.4],
    [S[7], "whoosh", 0.3], [S[7] + 0.2, "count", 0.3], [S[8] + 0.1, "count", 0.3], [S[9], "pop", 0.4], [S[10], "pop2", 0.4], [S[10] + 0.5, "pop2", 0.4],
    [S[11], "pop", 0.4], [S[11] + 0.4, "pop3", 0.4], [S[12], "swipe", 0.3], [S[12] + 0.6, "ding", 0.4],
    [S[13], "whoosh", 0.3], [S[14] + 0.1, "count", 0.3], [S[14] + 1.5, "ding", 0.45],
    [S[15], "pop", 0.4], [S[16], "pop", 0.4], [S[17], "snap", 0.5], [S[18], "pop", 0.4], [S[19], "pop", 0.4],
    [S[20], "swipe", 0.3], [S[20] + 0.4, "ding", 0.4], [S[21], "pop", 0.4], [S[22], "pop", 0.45], [S[22] + 0.25, "thud", 0.45], [S[23], "pop", 0.4], [S[23] + 0.3, "ding", 0.5],
  ];
  return (
    <Reel music="r1" musicVol={0.3} voice="voz1" sfx={sfx}>
      <B tl={tl1} i={0}><Rise now from={260}><T size={140}>Quanto custa um <O>site</O> hoje em dia?</T></Rise></B>
      <B tl={tl1} i={1}><Money label="SIMPLES" to={800} /></B>
      <B tl={tl1} i={2}><Label1>SIMPLES</Label1><Rise delay={3} style={{ marginTop: 34 }}><T size={150} color={C.orange2} style={{ letterSpacing: -4 }}><Cnt prefix="a R$ " to={2000} /></T></Rise></B>
      <B tl={tl1} i={3}><Phrase tier="SIMPLES">Cartão de visita <O>online.</O></Phrase></B>
      <B tl={tl1} i={4}><Phrase tier="SIMPLES">Para <O>profissionais liberais.</O></Phrase></B>
      <B tl={tl1} i={5}><Phrase tier="SIMPLES">Uma página <O>única.</O></Phrase></B>
      <B tl={tl1} i={6}><Phrase tier="SIMPLES">Tipo o <O>link da bio.</O></Phrase></B>
      <B tl={tl1} i={7}><Money label="MÉDIO" to={2000} /></B>
      <B tl={tl1} i={8}><Label1>MÉDIO</Label1><Rise delay={3} style={{ marginTop: 34 }}><T size={150} color={C.orange2} style={{ letterSpacing: -4 }}><Cnt prefix="a R$ " to={5000} /></T></Rise></B>
      <B tl={tl1} i={9}><Phrase tier="MÉDIO">Páginas.</Phrase></B>
      <B tl={tl1} i={10}>
        <Phrase tier="MÉDIO" size={100}>Integração com</Phrase>
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          <Pop delay={8}><div style={{ background: C.orange, borderRadius: 40, padding: "14px 40px" }}><T size={72} color={C.bg}>WhatsApp</T></div></Pop>
          <Pop delay={16}><div style={{ background: C.orange, borderRadius: 40, padding: "14px 40px" }}><T size={72} color={C.bg}>Google</T></div></Pop>
        </div>
      </B>
      <B tl={tl1} i={11}><MapPin /><Rise delay={6} style={{ marginTop: 40 }}><T size={104}>Para empresas locais que querem <O>ser vistas.</O></T></Rise></B>
      <B tl={tl1} i={12}><MapPin lift /><Rise delay={4} style={{ marginTop: 40 }}><T size={104}>Mais valor.<br /><O>Melhor posição</O> no mapa.</T></Rise></B>
      <B tl={tl1} i={13}><Label1>COMPLETO</Label1><Rise delay={4} style={{ marginTop: 34 }}><T size={140}>Um site <O>completo.</O></T></Rise></B>
      <B tl={tl1} i={14}><Label1>COMPLETO</Label1><Rise delay={3} style={{ marginTop: 34 }}><T size={80} weight={600} color={C.mute}>a partir de</T></Rise><Rise delay={5}><T size={190} style={{ letterSpacing: -5 }}><Cnt prefix="R$ " to={5000} start={8} dur={28} suffix="+" /></T></Rise></B>
      <B tl={tl1} i={15}><Rise now from={200}><T size={134}>Aquele que <O>vende sozinho.</O></T></Rise><Rise delay={14} style={{ marginTop: 30 }}><T size={64} weight={500} color={C.mute}>Trabalha por você.</T></Rise></B>
      <B tl={tl1} i={16}><Rise now from={180}><T size={130}>Estrutura <O>robusta.</O></T></Rise></B>
      <B tl={tl1} i={17}><Gear /><Rise delay={4} style={{ marginTop: 40 }}><T size={140}><O>Automação.</O></T></Rise></B>
      <B tl={tl1} i={18}><Rise now from={180}><T size={118}>Páginas de <O>alta conversão.</O></T></Rise></B>
      <B tl={tl1} i={19}><Rise now from={180}><T size={118}>Prontas para <O>anúncios.</O></T></Rise></B>
      <B tl={tl1} i={20}><Rise now from={160}><T size={96} weight={600}>O diferencial da</T></Rise><Signature delay={4} /></B>
      <B tl={tl1} i={21}><Rise now from={200}><T size={104}>Preços que <O>cobrem a concorrência</O> do mercado.</T></Rise></B>
      <B tl={tl1} i={22}><CtaWord word="PREÇO" /></B>
      <B tl={tl1} i={23}>
        <Rise><T size={100}>e eu te mando a nossa <O>tabela.</O></T></Rise>
        <Signature />
      </B>
    </Reel>
  );
};

// =====================================================================
// 2. Procure seu negócio no Google
// =====================================================================
// Reel 2 sincronizado com a narração (voz acelerada em 1,10x): tempos medidos no áudio original e divididos por 1,10
const K2 = 1 / 1.1;
export const tl2 = timeline([2.15, 2.15, 1.7, 1.85, 2.65, 2.5, 1.3, 1.7, 1.7, 2.0, 1.4, 1.4, 1.8, 2.0, 2.3, 1.6, 1.65, 2.15, 2.1, 1.2, 1.4, 1.5, 2.3].map((d) => +(d * K2).toFixed(3)));

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
    [0.02, "pop", 0.45],
    [S[1], "whoosh", 0.3], [S[1] + 0.2, "typing", 0.3],
    [S[2] + 0.05, "typing", 0.3], [S[3] + 0.1, "typing", 0.3], [S[3] + 1.1, "click", 0.45],
    [S[4], "pop", 0.4],
    [S[5] + 0.15, "swipe", 0.3], [S[5] + 0.45, "error", 0.35], [S[5] + 0.95, "ding", 0.45],
    [S[6], "pop", 0.4], [S[7], "pop", 0.4], [S[7] + 0.6, "error", 0.3], [S[8], "pop", 0.4], [S[9], "pop", 0.4], [S[10], "pop", 0.4], [S[11], "pop", 0.4],
    [S[12], "whoosh", 0.3], [S[13] + 0.1, "pop2", 0.4], [S[13] + 0.4, "pop2", 0.4], [S[13] + 0.7, "pop2", 0.4], [S[13] + 1.0, "ding", 0.45],
    [S[14], "pop", 0.4], [S[15], "pop", 0.4], [S[16] + 0.1, "click", 0.45], [S[16] + 0.3, "ding", 0.45],
    [S[17], "pop", 0.4], [S[18], "pop", 0.4], [S[18] + 1.1, "thud", 0.5],
    [S[19], "swipe", 0.3], [S[20], "magnet", 0.4], [S[21], "pop", 0.45], [S[21] + 0.25, "ding", 0.5], [S[22], "pop", 0.4], [S[22] + 0.3, "ding", 0.5],
  ];
  const Chip: React.FC<{ t: string; d: number }> = ({ t, d }) => (
    <Pop delay={d}><div style={{ background: C.orange, borderRadius: 40, padding: "14px 40px" }}><T size={62} color={C.bg}>{t}</T></div></Pop>
  );
  const Chameleon: React.FC = () => {
    const frame = useCurrentFrame();
    return (
      <Pop now>
        <img src={staticFile("remotion/brand/simbolo-laranja.png")} style={{ height: 230, filter: `hue-rotate(${Math.sin(frame / 7) * 120}deg) saturate(${1.2 + Math.sin(frame / 5) * 0.4})`, opacity: 0.55 + 0.45 * Math.abs(Math.sin(frame / 9)) }} />
      </Pop>
    );
  };
  return (
    <Reel music="r2" musicVol={0.3} voice="voz2" sfx={sfx}>
      <B tl={tl2} i={0}><Rise now from={240}><T size={140}>Pare o que você está <O>fazendo agora.</O></T></Rise></B>
      <B tl={tl2} i={1}>
        <Rise now from={60}><T size={120}>Procure seu negócio no <O>Google.</O></T></Rise>
        <div style={{ marginTop: 100 }}><TypeBar start={999} dur={1} /></div>
      </B>
      <B tl={tl2} i={2}>
        <Rise now from={80}><T size={96} style={{ marginBottom: 60 }}>Digite o que o seu cliente <O>digitaria</O></T></Rise>
        <TypeBar start={2} dur={34} pulse width={920} />
      </B>
      <B tl={tl2} i={3}>
        <Rise now from={80}><T size={96} style={{ marginBottom: 60 }}>para encontrar <O>seu serviço.</O></T></Rise>
        <TypeBar start={0} dur={1} pulse width={920} />
      </B>
      <B tl={tl2} i={4}><Rise now from={160}><T size={118}>Veja a <O>diferença</O> na mesma busca.</T></Rise><Rise delay={14} style={{ marginTop: 50 }}><T size={64} color={C.mute}>buscando…</T></Rise></B>
      <B tl={tl2} i={5}>
        <Rise delay={0}><T size={78} style={{ marginBottom: 50 }}>Dois resultados <O>totalmente diferentes.</O></T></Rise>
        <Columns />
      </B>
      <B tl={tl2} i={6}><Rise now from={180}><T size={160} color={C.mute}>Sem site:</T></Rise></B>
      <B tl={tl2} i={7}>
        <Rise now from={120}><T size={104}>Só um <O>perfil perdido.</O></T></Rise>
        <Shake at={14}><div style={{ marginTop: 50 }}><Columns focus="left" drop={false} /></div></Shake>
      </B>
      <B tl={tl2} i={8}><Rise now from={160}><T size={116}>Ninguém sabe se está <O>aberto.</O></T></Rise></B>
      <B tl={tl2} i={9}><Rise now from={160}><T size={116}>Pouca informação. <O>Nenhuma história.</O></T></Rise></B>
      <B tl={tl2} i={10}><Rise now from={160}><T size={120}>Ainda precisa <O>procurar</O></T></Rise></B>
      <B tl={tl2} i={11}><Rise now from={160}><T size={120}>no <O>Instagram</O> depois.</T></Rise></B>
      <B tl={tl2} i={12}><Rise now from={160}><T size={140}><O>Com site,</O> o cliente vê</T></Rise></B>
      <B tl={tl2} i={13}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>
          <Chip t="Horários" d={4} /><Chip t="Fotos" d={13} /><Chip t="WhatsApp" d={22} />
        </div>
      </B>
      <B tl={tl2} i={14}>
        <Rise now from={140}><T size={118}>Sua <O>história.</O></T></Rise>
        <Rise delay={16} style={{ marginTop: 24 }}><T size={118}>E se conecta <O>com você.</O></T></Rise>
      </B>
      <B tl={tl2} i={15}><Rise now from={160}><T size={116}>Chama o cliente para uma <O>ação.</O></T></Rise></B>
      <B tl={tl2} i={16}>
        <Pop now><div style={{ background: C.orange, borderRadius: 60, padding: "40px 90px" }}><T size={96} color={C.bg}>Fale no WhatsApp</T></div></Pop>
      </B>
      <B tl={tl2} i={17}><Rise now from={160}><T size={120}>Tem <O>tudo</O> o que o cliente precisa.</T></Rise></B>
      <B tl={tl2} i={18}>
        <Rise now from={160}><T size={130}>Quem aparece melhor,</T></Rise>
        <Pop delay={22} style={{ marginTop: 10 }}><T size={210} color={C.orange} style={{ letterSpacing: -5 }}>vende!</T></Pop>
      </B>
      <B tl={tl2} i={19}><Rise now from={160}><T size={120}>A <O>Khamora</O> vem</T></Rise><Signature delay={2} /></B>
      <B tl={tl2} i={20}><Chameleon /><Rise delay={4} style={{ marginTop: 40 }}><T size={104}>tirar a <O>camuflagem</O> da sua marca.</T></Rise></B>
      <B tl={tl2} i={21}><CtaWord word="SITE" /></B>
      <B tl={tl2} i={22}><Rise now from={160}><T size={104}>e dá uma olhada <O>na sua DM.</O></T></Rise><Signature /></B>
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
