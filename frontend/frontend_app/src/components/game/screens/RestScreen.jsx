import { useState } from "react";
import { API_BASE, SCENE_BG, styles } from "@/components/game/shared/gameStyles";
import SceneLayout from "@/components/game/shared/SceneLayout";
import HealthBar from "@/components/game/shared/HealthBar";

export default function RestScreen({ sessionId, nodeData, onContinue }) {
  const [hp,      setHp]     = useState(nodeData?.player_hp     ?? 80);
  const [maxHp,   setMaxHp]  = useState(nodeData?.player_max_hp ?? 100);
  const [healed,  setHealed] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleRest() {
    if (healed !== null || loading) return;
    setLoading(true);
    fetch(`${API_BASE}/api/game/rest/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(r => r.json())
      .then(data => { setHp(data.hp); setMaxHp(data.max_hp); setHealed(data.healed); })
      .finally(() => setLoading(false));
  }

  return (
    <SceneLayout bgPath={SCENE_BG.rest} overlayOpacity={0.5}>
      <div style={{ ...styles.center, position: "relative", zIndex: 2, gap: 20 }}>
        <h2 style={{ margin: 0 }}>Rest Site</h2>
        <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>You find a moment of peace.</p>

        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 6 }}>
          <HealthBar current={hp} max={maxHp} />
          <span style={{ color: "#aaa", fontSize: 12, textAlign: "center" }}>{hp} / {maxHp} HP</span>
        </div>

        {healed !== null
          ? <p style={{ color: "#5cb85c", fontSize: 14, margin: 0 }}>You recovered {healed} HP.</p>
          : <button onClick={handleRest} disabled={loading} style={{ ...styles.continueBtn, background: "#1a5c2a", minWidth: 180 }}>
              {loading ? "Resting…" : "Rest (Heal ~25%)"}
            </button>
        }

        <button onClick={onContinue} style={styles.btn}>Continue →</button>
      </div>
    </SceneLayout>
  );
}
