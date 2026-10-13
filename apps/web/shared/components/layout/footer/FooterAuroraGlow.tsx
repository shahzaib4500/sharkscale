import { colors } from "@shared/constants/colors";

export default function FooterAuroraGlow() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "80vw",
        height: "60vh",
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 50%, ${colors.primary}44 0%, ${colors.secondary}22 45%, transparent 70%)`,
        filter: "blur(80px)",
        animation: "footer-breathe 8s ease-in-out infinite alternate",
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  );
}
