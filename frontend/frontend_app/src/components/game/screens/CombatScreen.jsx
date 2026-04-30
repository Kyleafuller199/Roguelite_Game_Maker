import { useNavigate } from "react-router-dom";
import { API_BASE, SCENE_BG, styles } from "@/components/game/shared/gameStyles";
import HealthBar  from "@/components/game/shared/HealthBar";
import CardPile   from "@/components/game/shared/CardPile";
import CombatCard, { effectDesc } from "@/components/game/shared/CombatCard";

export default function CombatScreen({
  gameState,
  monsterInfo,
  activeNode,
  outcome,
  drawCount,
  discardCount,
  drawPile,
  discardPile,
  onPlayCard,
  onEndTurn,
  onBack,
}) {
  const navigate = useNavigate();

  const combat = gameState?.combat;
  const player = combat?.player;
  const enemy  = combat?.monster;
  const turn   = combat?.combat;

  const sceneBg       = SCENE_BG[activeNode?.type] ?? SCENE_BG.battle;
  const monsterFolder = monsterInfo?.folder ?? "basic";
  const monsterImg    = monsterInfo?.imageUrl ?? "";
  const monsterName   = monsterInfo?.name ?? "Enemy";

  const payload    = JSON.parse(sessionStorage.getItem("runPayload") ?? "{}");
  const charImg    = payload?.character?.imageUrl ?? "";
  const charName   = payload?.character?.name ?? "Hero";

  const intentId   = enemy?.intent;
  const enemyData  = payload?.enemyMap?.[monsterInfo?.id];
  const intentMove = enemyData?.moves?.find(m => m.id === intentId) ?? null;

  return (
    <div style={{ ...styles.page, position: "relative" }}>

      {/* Scene background */}
      <img
        src={`${API_BASE}/api/assets/file/?path=${sceneBg}`}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />

      {/* Top bar */}
      <div style={{ ...styles.topBar, position: "relative", zIndex: 2 }}>
        <button onClick={onBack} style={styles.btn}>← Map</button>
        <span style={{ color: "#ccc", fontSize: 13, textTransform: "capitalize" }}>
          {activeNode?.type ?? "Combat"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#f0c030", fontSize: 13 }}>⚡</span>
          <span style={{ fontWeight: 700 }}>{turn?.energy ?? 0}</span>
          <span style={{ color: "#555" }}>/ 3</span>
        </div>
      </div>

      {/* Battle area */}
      <div style={{
        flex: 1, position: "relative", zIndex: 2,
        display: "flex", alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 40px 20px",
        gap: 280,
      }}>
        {/* Player — left */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={styles.statBox}>
            <span style={{ fontWeight: 700 }}>{charName}</span>
            <HealthBar current={player?.health ?? 0} max={player?.max_health ?? 100} />
            <span style={{ fontSize: 11, color: "#aaa" }}>
              {player?.health ?? 0} / {player?.max_health ?? 100}
            </span>
            {(turn?.player_block ?? 0) > 0 && (
              <span style={styles.blockBadge}>🛡 {turn.player_block}</span>
            )}
          </div>
          <img
            src={`${API_BASE}/api/assets/file/?path=playable_characters/${charImg}`}
            alt=""
            style={{ ...styles.sprite, maxWidth: 360, maxHeight: 440 }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Monster — right */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={styles.statBox}>
            <span style={{ fontWeight: 700 }}>{monsterName}</span>
            <HealthBar current={enemy?.health ?? 0} max={enemy?.max_health ?? 100} />
            <span style={{ fontSize: 11, color: "#aaa" }}>
              {enemy?.health ?? 0} / {enemy?.max_health ?? 100}
            </span>
            {(turn?.enemy_block ?? 0) > 0 && (
              <span style={styles.blockBadge}>🛡 {turn.enemy_block}</span>
            )}
            {intentMove && (
              <div style={{
                fontSize: 11, color: "#e5a230",
                background: "rgba(229,162,48,0.1)",
                border: "1px solid rgba(229,162,48,0.25)",
                borderRadius: 6, padding: "4px 10px",
                textAlign: "center", lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 700 }}>⚠ {intentMove.name}</div>
                {(intentMove.effects ?? []).map((eff, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#c8913a" }}>
                    {effectDesc(eff)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <img
            src={`${API_BASE}/api/assets/file/?path=monsters/${monsterFolder}/${monsterImg}`}
            alt=""
            style={styles.sprite}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
      </div>

      {/* Win / Lose overlay */}
      {outcome && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(0,0,0,0.75)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <h2 style={{ margin: 0, fontSize: 36, color: outcome === "victory" ? "#f0c030" : "#c0392b" }}>
            {outcome === "victory" ? "Victory!" : "Defeat"}
          </h2>
          <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>
            {outcome === "victory" ? "The enemy has been defeated." : "You have fallen in battle."}
          </p>
          {outcome === "victory"
            ? <button onClick={onBack} style={styles.continueBtn}>Continue</button>
            : <button onClick={() => navigate("/editor")} style={{ ...styles.continueBtn, background: "#8a2020" }}>Back to Editor</button>
          }
        </div>
      )}

      {/* Hand */}
      <div style={{ ...styles.hand, position: "relative", zIndex: 2 }}>
        <CardPile label="Draw" count={drawCount} cards={drawPile} />
        <div style={{ ...styles.cardRow, justifyContent: "center" }}>
          {(player?.hand ?? []).map((card) => (
            <CombatCard
              key={card.index}
              card={card}
              energy={turn?.energy ?? 0}
              onClick={() => onPlayCard(card.index)}
            />
          ))}
          {(player?.hand ?? []).length === 0 && (
            <span style={{ color: "#555", fontSize: 13, alignSelf: "center" }}>No cards in hand</span>
          )}
        </div>
        <CardPile label="Discard" count={discardCount} cards={discardPile} faded />
        <button onClick={onEndTurn} style={styles.endTurnBtn}>
          End<br />Turn
        </button>
      </div>

    </div>
  );
}
