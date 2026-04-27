import { API_BASE, SCENE_BG, styles } from "@/components/game/shared/gameStyles";

export default function RestScreen({ onContinue }) {
  return (
    <div style={{ ...styles.page, position: "relative" }}>
      <img
        src={`${API_BASE}/api/assets/file/?path=${SCENE_BG.rest}`}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />
      <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: 0 }}>Rest Site</h2>
        <p style={{ color: "#aaa", fontSize: 14 }}>You take a moment to recover.</p>
        <button onClick={onContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </div>
  );
}
