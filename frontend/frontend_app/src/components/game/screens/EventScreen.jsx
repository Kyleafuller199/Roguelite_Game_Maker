import { API_BASE, SCENE_BG, styles } from "@/components/game/shared/gameStyles";

export default function EventScreen({ onContinue }) {
  return (
    <div style={{ ...styles.page, position: "relative" }}>
      <img
        src={`${API_BASE}/api/assets/file/?path=${SCENE_BG.event}`}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1 }} />
      <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: 0 }}>Event</h2>
        <p style={{ color: "#aaa", fontSize: 14, maxWidth: 360, textAlign: "center" }}>
          Something stirs in the darkness. You sense both danger and opportunity.
        </p>
        <button onClick={onContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </div>
  );
}
