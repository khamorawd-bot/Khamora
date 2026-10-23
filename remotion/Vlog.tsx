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
export const A_FRAMES = 475;
export const B_FRAMES = 499;
export const FLASH = 6;
export const VLOG_FRAMES = A_FRAMES + B_FRAMES - FLASH;

// Slow push-in with a small "punch" zoom at each cut point.
const Punchy: React.FC<{ src: string; punches: number[]; drift: number; children?: React.ReactNode }> = ({
  src,
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
      <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {children}
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = ["DIA 3", "CRIANDO SITES PARA MARCAS", "ATÉ SER CONTRATADO"];
  const out = interpolate(frame, [84, 96], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 480, opacity: out }}>
      {/* blurred copy of the clip hides the caption burned into the source */}
      <div
        style={{
          position: "absolute",
          top: 440,
          left: 0,
          right: 0,
          height: 300,
          overflow: "hidden",
          maskImage: "linear-gradient(transparent, #000 18%, #000 82%, transparent)",
        }}
      >
        <OffthreadVideo
          src={staticFile("remotion/a.mp4")}
          muted
          style={{ position: "absolute", top: -440, width: "100%", height: 1920, objectFit: "cover", filter: "blur(36px) brightness(0.8)" }}
        />
      </div>
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
  const flashAt = A_FRAMES - FLASH;
  const flash = interpolate(frame, [flashAt - 2, flashAt + FLASH / 2, flashAt + FLASH + 4], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={A_FRAMES}>
        <Punchy src="remotion/a.mp4" punches={[90, 150, 240, 330, 400]} drift={0.05}>
          <Sequence durationInFrames={100}>
            <Title />
          </Sequence>
        </Punchy>
      </Sequence>
      <Sequence from={A_FRAMES - FLASH} durationInFrames={B_FRAMES}>
        <Punchy src="remotion/b.mp4" punches={[0, 100, 190, 290, 390]} drift={0.06} />
      </Sequence>
      {/* cut flash + vignette */}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45))" }} />
    </AbsoluteFill>
  );
};
