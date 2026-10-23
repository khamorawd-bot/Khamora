import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const OPEN_FRAMES = 115;
export const A_CUT = 90; // first 3s of a.mp4 is the old brown-shirt intro
export const A_FRAMES = 475 - A_CUT;
export const B_FRAMES = 499;
export const FLASH = 6;
export const VLOG_FRAMES = OPEN_FRAMES + A_FRAMES + B_FRAMES - 2 * FLASH;

// Slow push-in with a small "punch" zoom at each cut point.
const Punchy: React.FC<{ src: string; punches: number[]; drift: number; startFrom?: number; children?: React.ReactNode }> = ({
  src,
  startFrom = 0,
  punches,
  drift,
  children,
}) => {
  const frame = useCurrentFrame();
  const base = 1 + (frame / 450) * drift;
  const punch = punches.reduce((acc, p) => {
    const d = frame - p;
    return d >= 0 && d < 12 ? Math.max(acc, interpolate(d, [0, 12], [0.07, 0], { easing: Easing.out(Easing.cubic) })) : acc;
  }, 0);
  return (
    <AbsoluteFill style={{ transform: `scale(${base + punch})` }}>
      <OffthreadVideo src={staticFile(src)} startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {children}
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = ["DIA 3", "CRIANDO SITES PARA MARCAS", "ATÉ SER CONTRATADO"];
  const out = interpolate(frame, [85, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 420, opacity: out }}>
      {lines.map((t, i) => {
        const s = spring({ frame: frame - 3 - i * 5, fps, config: { damping: 14, stiffness: 160 } });
        return (
          <div
            key={t}
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: i === 0 ? 120 : 62,
              letterSpacing: i === 0 ? 4 : 1,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.15,
              marginTop: i === 1 ? 14 : 0,
              textShadow: "0 4px 24px rgba(0,0,0,0.55)",
              opacity: s,
              transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})`,
            }}
          >
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Vlog: React.FC = () => {
  const frame = useCurrentFrame();
  const aStart = OPEN_FRAMES - FLASH;
  const bStart = aStart + A_FRAMES - FLASH;
  const flashAt = (f: number) =>
    interpolate(frame, [f - 2, f + FLASH / 2, f + FLASH + 4], [0, 0.9, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const flash = Math.max(flashAt(aStart), flashAt(bStart));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={OPEN_FRAMES}>
        <Punchy src="remotion/open.mp4" punches={[]} drift={0.04}>
          <Sequence durationInFrames={OPEN_FRAMES}>
            <Title />
          </Sequence>
        </Punchy>
      </Sequence>
      <Sequence from={aStart} durationInFrames={A_FRAMES}>
        <Punchy src="remotion/a.mp4" startFrom={A_CUT} punches={[]} drift={0.05} />
      </Sequence>
      <Sequence from={bStart} durationInFrames={B_FRAMES}>
        <Punchy src="remotion/b.mp4" punches={[]} drift={0.06} />
      </Sequence>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45))" }} />
    </AbsoluteFill>
  );
};
