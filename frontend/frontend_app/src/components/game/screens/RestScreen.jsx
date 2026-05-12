import { SCENE_BG, styles } from "@/components/game/shared/gameStyles";
import SceneLayout from "@/components/game/shared/SceneLayout";

export default function RestScreen({ onContinue }) {
  return (
    <SceneLayout bgPath={SCENE_BG.rest} overlayOpacity={0.5}>
      <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: 0 }}>Rest Site</h2>
        <p style={{ color: "#aaa", fontSize: 14 }}>You take a moment to recover.</p>
        <button onClick={onContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </SceneLayout>
  );
}
