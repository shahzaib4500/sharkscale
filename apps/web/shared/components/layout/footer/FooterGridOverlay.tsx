import { colors } from "@shared/constants/colors";

export default function FooterGridOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundSize: "60px 60px",
        backgroundImage: `
          linear-gradient(to right, ${colors.cream}08 1px, transparent 1px),
          linear-gradient(to bottom, ${colors.cream}08 1px, transparent 1px)
        `,
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  );
}
