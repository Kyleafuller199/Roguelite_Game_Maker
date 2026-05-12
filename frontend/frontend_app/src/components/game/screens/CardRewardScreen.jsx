/**
 * CardRewardScreen.jsx
 *
 * Post-combat card reward selection. Shown after any combat victory when the
 * character's card pool has at least one non-starter card available.
 *
 * Displays up to 3 randomly selected cards from the pool. The player clicks
 * one to add it permanently to their run deck, or skips to take nothing.
 * Play.jsx owns the randomisation logic so the same picks stay stable for
 * the lifetime of the reward screen.
 */

import { useState } from "react";
import { styles } from "@/components/game/shared/gameStyles";
import CombatCard from "@/components/game/shared/CombatCard";

export default function CardRewardScreen({ rewardCards = [], onSelectCard, onSkip }) {
  const [pickedId, setPickedId] = useState(null);

  function handlePick(card) {
    if (pickedId) return; // prevent double-click
    setPickedId(card.id);
    onSelectCard(card);
  }

  return (
    <div style={styles.page}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ ...styles.topBar }}>
        <span style={{ color: "#f0c030", fontSize: 14, fontWeight: 700 }}>
          Choose a Card Reward
        </span>
        <button onClick={onSkip} style={{ ...styles.btn, marginLeft: "auto" }}>
          Skip
        </button>
      </div>

      {/* ── Subtitle ────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "20px 0 0", position: "relative", zIndex: 2 }}>
        <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
          Select one card to add to your deck for the rest of this run.
        </p>
      </div>

      {/* ── Card options ────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "32px 40px",
      }}>
        {rewardCards.length === 0 ? (
          <span style={{ color: "#555", fontSize: 14 }}>No card rewards available.</span>
        ) : (
          rewardCards.map(card => (
            <div
              key={card.id}
              style={{
                transform: pickedId === card.id ? "scale(1.12) translateY(-12px)" : "none",
                transition: "transform 0.2s ease",
                opacity: pickedId && pickedId !== card.id ? 0.35 : 1,
              }}
            >
              <CombatCard
                card={card}
                energy={999}
                onClick={() => handlePick(card)}
              />
            </div>
          ))
        )}
      </div>

    </div>
  );
}
