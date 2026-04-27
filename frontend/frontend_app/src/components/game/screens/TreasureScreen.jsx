import { API_BASE, SCENE_BG, styles } from "@/components/game/shared/gameStyles";

export default function TreasureScreen({ onContinue }) {
  return (
    <div style={{ ...styles.page, position: "relative" }}>
      <img
        src={`${API_BASE}/api/assets/file/?path=${SCENE_BG.treasure}`}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />
      <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: 0 }}>Treasure</h2>
        <p style={{ color: "#aaa", fontSize: 14 }}>You found something valuable.</p>
        <button onClick={onContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </div>
  );
}
