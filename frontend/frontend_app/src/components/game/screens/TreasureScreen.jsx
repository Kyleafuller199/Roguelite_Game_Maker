import { SCENE_BG, styles } from "@/components/game/shared/gameStyles";
import SceneLayout from "@/components/game/shared/SceneLayout";

export default function TreasureScreen({ onContinue }) {
  return (
    <SceneLayout bgPath={SCENE_BG.treasure} overlayOpacity={0.5}>
      <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
        <h2 style={{ margin: 0 }}>Treasure</h2>
        <p style={{ color: "#aaa", fontSize: 14 }}>You found something valuable.</p>
        <button onClick={onContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </SceneLayout>
  );
}
