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
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Identidade Khamora: fundo cinza escuro, laranja, DM Sans
export const C = {
  bg: "#232323",
  bg2: "#1B1B1B",
  card: "#2E2E2E",
  card2: "#3A3A3A",
  orange: "#FF6900",
  orange2: "#FF8A2B",
  white: "#FFFFFF",
  warm: "#FAF9F6",
  mute: "#A9A9A9",
  red: "#FF4D4D",
  green: "#3DDC97",
};
export const FONT = '"DM Sans", Arial, sans-serif';
export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

export const useDmSans = () => {
  const [handle] = useState(() => delayRender("dm-sans"));
  useEffect(() => {
    Promise.all(
      [400, 500, 600, 700].flatMap((w) =>
        ["latin", "latin-ext"].map((s) =>
          new FontFace("DM Sans", `url(${staticFile(`remotion/fonts/dm-sans-${s}-${w}-normal.woff2`)})`, { weight: String(w) })
            .load()
            .then((ff) => document.fonts.add(ff)),
        ),
      ),
    )
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle]);
};

// ---------- linha do tempo ----------
export type Timeline = { D: number[]; S: number[]; total: number };
export const timeline = (D: number[]): Timeline => {
  const S: number[] = [];
  let t = 0;
  D.forEach((d) => {
    S.push(t);
    t += d;
  });
  return { D, S, total: t };
};

const BeatIdx = createContext(0);
export const useBeat = () => useContext(BeatIdx);

const GLOWS = [
  [20, 85],
  [85, 20],
  [15, 15],
  [80, 80],
];

// corte seco: cada beat é uma "cena" de 1,5 a 2 s; sempre em movimento (zoom lento)
export const B: React.FC<{ tl: Timeline; i: number; children: React.ReactNode; glow?: boolean }> = ({ tl, i, children, glow = true }) => {
  const dur = f(tl.D[i]);
  return (
    <Sequence from={f(tl.S[i])} durationInFrames={dur}>
      <BeatIdx.Provider value={i}>
        <BeatBody dur={dur} glow={glow}>{children}</BeatBody>
      </BeatIdx.Provider>
    </Sequence>
  );
};

const BeatBody: React.FC<{ dur: number; glow: boolean; children: React.ReactNode }> = ({ dur, glow, children }) => {
  const frame = useCurrentFrame();
  const i = useBeat();
  const [gx, gy] = GLOWS[i % 4];
  const z = interpolate(frame, [0, dur], [1, 1.04]);
  return (
    <AbsoluteFill>
      {glow && (
        <AbsoluteFill
          style={{ background: `radial-gradient(760px 760px at ${gx}% ${gy}%, rgba(255,105,0,0.20), transparent 70%)` }}
        />
      )}
      <AbsoluteFill style={{ transform: `scale(${z})`, justifyContent: "center", alignItems: "center", padding: "0 80px", paddingBottom: 80 }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- animações ----------
export const useSp = (delay = 0, damping = 13, stiffness = 150) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness, mass: 0.8 } });
};

// entra por baixo com mola. `now` = já visível no quadro 1 (gancho)
export const Rise: React.FC<{ delay?: number; now?: boolean; from?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  now = false,
  from = 150,
  children,
  style,
}) => {
  const s = useSp(delay);
  const op = now ? 1 : Math.min(1, s * 4);
  return <div style={{ opacity: op, transform: `translateY(${(1 - s) * from}px)`, ...style }}>{children}</div>;
};

export const Pop: React.FC<{ delay?: number; now?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  now = false,
  children,
  style,
}) => {
  const s = useSp(delay, 11, 190);
  const op = now ? 1 : Math.min(1, s * 4);
  return <div style={{ opacity: op, transform: `scale(${0.5 + 0.5 * s})`, ...style }}>{children}</div>;
};

export const useCount = (to: number, startF = 0, durF = 30, from = 0) => {
  const frame = useCurrentFrame();
  return Math.round(
    interpolate(frame, [startF, startF + durF], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
};

export const Shake: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  const x = k >= 0 && k < 14 ? Math.sin(k * 2.2) * (14 - k) * 1.6 : 0;
  return <div style={{ transform: `translateX(${x}px)` }}>{children}</div>;
};

// ---------- texto ----------
type TP = { size?: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode };
export const T: React.FC<TP> = ({ size = 110, weight = 700, color = C.white, style, children }) => (
  <div style={{ fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 1.1, color, textAlign: "center", letterSpacing: -1.5, maxWidth: 920, ...style }}>
    {children}
  </div>
);
export const O: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.orange }}>{children}</span>;

// pílula de CTA: palavra de uma palavra para comentar
export const CtaWord: React.FC<{ word: string; lead?: string; delay?: number }> = ({ word, lead = "Comente", delay = 0 }) => (
  <>
    <Rise delay={delay}><T size={92}>{lead}</T></Rise>
    <Pop delay={delay + 4} style={{ marginTop: 36 }}>
      <div style={{ background: C.orange, borderRadius: 36, padding: "22px 70px" }}>
        <T size={150} color={C.bg} style={{ letterSpacing: -3 }}>{word}</T>
      </div>
    </Pop>
  </>
);

// assinatura animada (não parada) para o fim
export const Signature: React.FC<{ delay?: number }> = ({ delay = 14 }) => {
  const s = useSp(delay, 14, 120);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 90, opacity: Math.min(1, s * 3), transform: `translateY(${(1 - s) * 40}px)` }}>
      <Img src={staticFile("remotion/brand/simbolo-laranja.png")} style={{ height: 64 }} />
      <Img src={staticFile("remotion/brand/wordmark-branco.png")} style={{ height: 56 }} />
    </div>
  );
};

// ---------- áudio ----------
export type SfxEvent = [number, string, number?];
export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.5 }) => (
  <Sequence from={f(at)} durationInFrames={f(2.2)} layout="none">
    <Audio src={staticFile(`remotion/sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const Reel: React.FC<{ music: string; musicVol?: number; voice?: string; sfx: SfxEvent[]; children: React.ReactNode }> = ({
  music,
  musicVol = 0.55,
  voice,
  sfx,
  children,
}) => {
  useDmSans();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {children}
      <Audio src={staticFile(`remotion/reels/audio/${music}.mp3`)} volume={musicVol} />
      {voice && <Audio src={staticFile(`remotion/reels/audio/${voice}.mp3`)} volume={1} />}
      {sfx.map(([at, name, v], k) => (
        <Sfx key={k} at={at} name={name} volume={v} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- peças visuais reutilizáveis ----------
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, borderRadius: 36, padding: "36px 44px", border: "2px solid rgba(255,255,255,0.08)", ...style }}>{children}</div>
);

export const Dot: React.FC<{ color: string }> = ({ color }) => <div style={{ width: 18, height: 18, borderRadius: 9, background: color }} />;

export const Browser: React.FC<{ width?: number; height?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  width = 860,
  height = 760,
  children,
  style,
}) => (
  <div style={{ width, height, background: "#F4F2EE", borderRadius: 30, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", ...style }}>
    <div style={{ height: 70, background: "#E4E1DA", display: "flex", alignItems: "center", gap: 12, padding: "0 26px" }}>
      <Dot color="#FF5F57" /><Dot color="#FEBC2E" /><Dot color="#28C840" />
      <div style={{ flex: 1, height: 38, borderRadius: 19, background: "#F8F7F4", marginLeft: 20 }} />
    </div>
    <div style={{ padding: 28, position: "relative", height: height - 70 }}>{children}</div>
  </div>
);

export const HouseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 360, color = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M100 22 L186 96 H166 V176 H34 V96 H14 Z" fill={color} />
    <rect x="82" y="116" width="36" height="60" rx="6" fill={C.bg} />
    <circle cx="110" cy="148" r="3.5" fill={color} />
  </svg>
);

export const PersonIcon: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="32" r="18" fill={color} />
    <path d="M14 92 C14 64 86 64 86 92 Z" fill={color} />
  </svg>
);

export const Clock: React.FC<{ size?: number; minuteDeg: number; color?: string }> = ({ size = 420, minuteDeg, color = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill={C.card} stroke={color} strokeWidth="8" />
    {Array.from({ length: 12 }).map((_, k) => (
      <line key={k} x1="100" y1="16" x2="100" y2={k % 3 === 0 ? 32 : 24} stroke={C.white} strokeWidth={k % 3 === 0 ? 5 : 3} transform={`rotate(${k * 30} 100 100)`} />
    ))}
    <line x1="100" y1="100" x2="100" y2="40" stroke={color} strokeWidth="7" strokeLinecap="round" transform={`rotate(${minuteDeg} 100 100)`} />
    <line x1="100" y1="100" x2="100" y2="62" stroke={C.white} strokeWidth="9" strokeLinecap="round" transform={`rotate(${minuteDeg / 12} 100 100)`} />
    <circle cx="100" cy="100" r="8" fill={color} />
  </svg>
);
