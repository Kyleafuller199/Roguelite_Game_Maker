import { SCENE_BG, styles } from "@/components/game/shared/gameStyles";
import SceneLayout from "@/components/game/shared/SceneLayout";

export default function EventScreen({ onContinue }) {
  return (
    <SceneLayout bgPath={SCENE_BG.event} overlayOpacity={0.6}>
      <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: 0 }}>? Event</h2>
        <p style={{ color: "#aaa", fontSize: 14, maxWidth: 360, textAlign: "center" }}>
          Something stirs in the darkness. You sense both danger and opportunity.
        </p>
        <p style={{ color: "#666", fontSize: 12, maxWidth: 360, textAlign: "center", margin: 0 }}>
          Event outcomes coming soon.
        </p>
        <button onClick={onContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </SceneLayout>
  );
}
