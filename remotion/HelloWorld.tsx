import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 30], [40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "#fff", fontSize: 120, opacity, transform: `translateY(${y}px)` }}>
        Hello Remotion
      </h1>
    </AbsoluteFill>
  );
};
