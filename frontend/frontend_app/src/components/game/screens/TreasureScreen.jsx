import { useState } from "react";
import { API_BASE, SCENE_BG, styles } from "@/components/game/shared/gameStyles";
import SceneLayout from "@/components/game/shared/SceneLayout";
import { relicEffectLines } from "@/components/game/shared/relicUtils";

export default function TreasureScreen({ sessionId, onRelicPick, onContinue }) {
  const [opened,  setOpened]  = useState(false);
  const [relics,  setRelics]  = useState([]);   // up to 2 relic options
  const [picked,  setPicked]  = useState(null); // chosen relic object
  const [loading, setLoading] = useState(false);

  function handleOpen() {
    if (opened || loading) return;
    setLoading(true);
    fetch(`${API_BASE}/api/game/treasure/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(r => r.json())
      .then(data => { setRelics(data.relics ?? []); setOpened(true); })
      .finally(() => setLoading(false));
  }

  function handlePick(relic, index) {
    if (picked) return;
    setPicked(relic);
    onRelicPick?.(relic);
    // Tell the backend which relic was chosen
    fetch(`${API_BASE}/api/game/treasure/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, choice_index: index }),
    });
  }

  return (
    <SceneLayout bgPath={SCENE_BG.treasure} overlayOpacity={0.5}>
      <div style={{ ...styles.center, position: "relative", zIndex: 2, gap: 20 }}>
        <h2 style={{ margin: 0 }}>Treasure</h2>

        {!opened && (
          <button onClick={handleOpen} disabled={loading} style={{ ...styles.continueBtn, minWidth: 180 }}>
            {loading ? "Opening…" : "Open Chest"}
          </button>
        )}

        {opened && relics.length === 0 && (
          <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>The chest is empty.</p>
        )}

        {opened && relics.length > 0 && !picked && (
          <>
            <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>Choose a relic:</p>
            <div style={{ display: "flex", gap: 24 }}>
              {relics.map((relic, i) => {
                const lines = relicEffectLines(relic);
                return (
                  <button key={relic.id ?? i} onClick={() => handlePick(relic, i)} style={{
                    background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,200,60,0.3)",
                    borderRadius: 12, padding: "16px 24px", color: "#e5e5e5",
                    cursor: "pointer", textAlign: "center", minWidth: 160, maxWidth: 220,
                  }}>
                    {relic.imageUrl && (
                      <img
                        src={`${API_BASE}/api/assets/file/?path=relics/${relic.imageUrl}`}
                        alt=""
                        style={{ width: 48, height: 48, objectFit: "contain", marginBottom: 8 }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    )}
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f0c030" }}>{relic.identity?.name ?? "Relic"}</div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{relic.identity?.rarity ?? ""}</div>
                    {lines.map((line, j) => (
                      <div key={j} style={{ fontSize: 10, color: "#bbb", marginTop: 4, lineHeight: 1.4 }}>{line}</div>
                    ))}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {picked && (
          <p style={{ color: "#f0c030", fontSize: 14, margin: 0 }}>
            You took <strong>{picked.identity?.name ?? "a relic"}</strong>.
          </p>
        )}

        {(picked || (opened && relics.length === 0)) && (
          <button onClick={onContinue} style={styles.btn}>Continue →</button>
        )}
      </div>
    </SceneLayout>
  );
}
