/**
 * CombatScreen.jsx
 *
 * Renders the full combat scene for battle, elite, and boss nodes.
 *
 * All game state (hp, hand, energy, monster intent) comes from the backend —
 * this component only displays what Kyle's combat engine returns.
 * Player actions (play card, end turn) are sent back up to Play.jsx which
 * calls the backend and passes the updated state back down as props.
 */

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { API_BASE, SCENE_BG, styles, colors, font, radius } from "@/components/game/shared/gameStyles";
import SceneLayout   from "@/components/game/shared/SceneLayout";
import HealthBar     from "@/components/game/shared/HealthBar";
import CardPile      from "@/components/game/shared/CardPile";
import CombatCard, { effectDesc } from "@/components/game/shared/CombatCard";

// Inline status-effect badges shown under HP/block in each stat box
function StatusBadges({ strength = 0, weakness = 0, vulnerable = 0, frail = 0 }) {
  const badges = [
    { label: "STR",   value: strength,   color: colors.statusStrength   },
    { label: "WEAK",  value: weakness,   color: colors.statusWeak       },
    { label: "VUL",   value: vulnerable, color: colors.statusVulnerable },
    { label: "FRAIL", value: frail,      color: colors.statusFrail      },
  ].filter(b => b.value > 0);

  if (badges.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginTop: 2 }}>
      {badges.map(b => (
        <span key={b.label} style={{
          fontSize: font.sizeXS, padding: "2px 5px", borderRadius: radius.sm,
          background: `${b.color}22`, border: `1px solid ${b.color}66`,
          color: b.color, fontWeight: 800, letterSpacing: 0.4,
        }}>
          {b.label} {b.value}
        </span>
      ))}
    </div>
  );
}

export default function CombatScreen({
  gameState,      // full state from Kyle's GameState.get_state()
  monsterInfo,    // name, imageUrl, folder — injected by the enter_node endpoint
  activeNode,     // the map node type (battle / elite / boss)
  outcome,        // "victory" | "defeat" | null
  drawCount,
  discardCount,
  drawPile,
  discardPile,
  onPlayCard,     // (cardIndex) → calls /api/game/play-card/
  onEndTurn,      // () → calls /api/game/end-turn/
  onBack,         // pauses mid-fight and returns to map
  onVictory,      // called when the player clicks Continue after winning
  hasReward,      // true when the character's card pool has reward options
}) {
  const navigate = useNavigate();

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  // E = end turn   1-5 = play the card at that hand position
  useEffect(() => {
    function onKey(e) {
      if (outcome) return;
      if (e.key === "e" || e.key === "E") { onEndTurn?.(); return; }
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5) {
        const hand = gameState?.combat?.player?.hand ?? [];
        const card = hand[n - 1];
        if (card && card.cost <= (gameState?.combat?.combat?.energy ?? 0)) onPlayCard?.(card.index);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [outcome, gameState, onEndTurn, onPlayCard]);

  // ── Unpack Kyle's game state ──────────────────────────────────────────────
  const combat = gameState?.combat;
  const player = combat?.player;   // { health, max_health, hand, deck_count }
  const enemy  = combat?.monster;  // { health, max_health, intent (move id) }
  const turn   = combat?.combat;   // { energy, player_block, enemy_block }

  // ── Scene background: switches per node type (battle / elite / boss) ──────
  const sceneBg = SCENE_BG[activeNode?.type] ?? SCENE_BG.battle;

  // ── Monster display info ──────────────────────────────────────────────────
  const monsterFolder = monsterInfo?.folder ?? "basic";
  const monsterImg    = monsterInfo?.imageUrl ?? "";
  const monsterName   = monsterInfo?.name ?? "Enemy";

  // ── Player display info (from the run payload saved at Start Run) ─────────
  const payload  = JSON.parse(sessionStorage.getItem("runPayload") ?? "{}");
  const charImg  = payload?.character?.imageUrl ?? "";
  const charName = payload?.character?.name ?? "Hero";

  // ── Enemy intent: look up the move the enemy will use this turn ───────────
  // intent is a move ID returned by the backend — we find the full move object
  // from the run payload's enemyMap so we can display the name and effects
  const intentId   = enemy?.intent;
  const enemyData  = payload?.enemyMap?.[monsterInfo?.id];
  const intentMove = enemyData?.moves?.find(m => m.id === intentId) ?? null;

  return (
    <SceneLayout bgPath={sceneBg} overlayOpacity={0.45}>

      {/* ── Top bar: back button, node type, energy display ──────────────── */}
      <div style={{ ...styles.topBar, position: "relative", zIndex: 2 }}>
        <button onClick={onBack} style={styles.btn}>← Map</button>
        <span style={{ color: colors.textSecondary, fontSize: font.sizeMD, textTransform: "capitalize" }}>
          {activeNode?.type ?? "Combat"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: colors.gold, fontSize: font.sizeMD }}>⚡</span>
          <span style={{ fontWeight: 700 }}>{turn?.energy ?? 0}</span>
          <span style={{ color: colors.textDisabled }}>/ 3</span>
        </div>
      </div>

      {/* ── Battle area: player left, enemy right ────────────────────────── */}
      <div style={{
        flex: 1, position: "relative", zIndex: 2,
        display: "flex", alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 40px 20px",
        gap: 280,
      }}>

        {/* Player: stat box (name, hp bar, block) + sprite */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={styles.statBox}>
            <span style={{ fontWeight: 700 }}>{charName}</span>
            <HealthBar current={player?.health ?? 0} max={player?.max_health ?? 100} />
            <span style={{ fontSize: font.sizeSM, color: colors.textMuted }}>
              {player?.health ?? 0} / {player?.max_health ?? 100}
            </span>
            {(turn?.player_block ?? 0) > 0 && (
              <span style={styles.blockBadge}>🛡 {turn.player_block}</span>
            )}
            <StatusBadges
              strength={combat?.status?.player_strength}
              weakness={combat?.status?.player_weakness}
              vulnerable={combat?.status?.player_vulnerable}
              frail={combat?.status?.player_frail}
            />
          </div>
          <img
            src={`${API_BASE}/api/assets/file/?path=playable_characters/${charImg}`}
            alt=""
            style={{ ...styles.sprite, maxWidth: 360, maxHeight: 440 }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Enemy: stat box (name, hp bar, block, next move) + sprite */}
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
            <StatusBadges
              strength={enemy?.strength}
              weakness={enemy?.weakness}
              vulnerable={enemy?.vulnerable}
              frail={enemy?.frail}
            />
            {/* Intent: shows the enemy's next move name and effects */}
            {intentMove && (
              <div style={{
                fontSize: font.sizeSM, color: colors.orange,
                background: "rgba(229,162,48,0.1)",
                border: "1px solid rgba(229,162,48,0.25)",
                borderRadius: radius.md, padding: "4px 10px",
                textAlign: "center", lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 700 }}>⚠ {intentMove.name}</div>
                {(intentMove.effects ?? []).map((eff, i) => (
                  <div key={i} style={{ fontSize: font.sizeXS, color: colors.orange }}>
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

      {/* ── Victory / defeat overlay ──────────────────────────────────────── */}
      {outcome && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(0,0,0,0.75)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <h2 style={{ margin: 0, fontSize: 36, color: outcome === "victory" ? colors.gold : colors.red }}>
            {outcome === "victory" ? "Victory!" : "Defeat"}
          </h2>
          <p style={{ color: colors.textMuted, fontSize: font.sizeLG, margin: 0 }}>
            {outcome === "victory" ? "The enemy has been defeated." : "You have fallen in battle."}
          </p>
          {outcome === "victory"
            ? (
              <button onClick={onVictory} style={styles.continueBtn}>
                {hasReward ? "Choose Reward →" : "Continue"}
              </button>
            )
            : (
              <button
                onClick={() => navigate("/editor")}
                style={{ ...styles.continueBtn, background: "#8a2020" }}
              >
                Back to Editor
              </button>
            )
          }
        </div>
      )}

      {/* ── Hand: draw pile | cards | discard pile | end turn ────────────── */}
      <div style={{ ...styles.hand, position: "relative", zIndex: 2 }}>

        {/* Draw pile — click to see all cards remaining in the deck */}
        <CardPile label="Draw" count={drawCount} cards={drawPile} />

        {/* Cards in hand — clicking a card calls onPlayCard → backend */}
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

        {/* Discard pile — click to see all played/discarded cards */}
        <CardPile label="Discard" count={discardCount} cards={discardPile} faded />

        {/* End turn — discards hand, runs enemy move, draws new hand of 5 */}
        <button onClick={onEndTurn} style={styles.endTurnBtn}>
          End<br />Turn
        </button>
      </div>

    </SceneLayout>
  );
}
