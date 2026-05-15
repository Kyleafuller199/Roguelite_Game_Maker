/**
 * CharacterSelectScreen.jsx
 *
 * Shown at the start of a run when a project has more than one character.
 * Displays a card for each character (portrait + name). Clicking a card
 * calls onSelectCharacter(characterId) and Play.jsx takes over to build
 * the session with that character's payload.
 */

import { useState } from "react";
import { API_BASE, styles, colors, font, radius } from "@/components/game/shared/gameStyles";

function CharacterCard({ character, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        background: hovered ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.55)",
        border: `2px solid ${hovered ? colors.borderStrong : colors.borderLight}`,
        borderRadius: radius.xxl, padding: "28px 36px",
        cursor: "pointer", color: colors.textPrimary,
        transform: hovered ? "translateY(-10px)" : "none",
        transition: "all 0.2s ease",
        minWidth: 180,
      }}
    >
      {character.imageUrl ? (
        <img
          src={`${API_BASE}/api/assets/file/?path=playable_characters/${character.imageUrl}`}
          alt={character.name}
          style={{ width: 140, height: 200, objectFit: "contain" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      ) : (
        <div style={{
          width: 140, height: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: colors.textDisabled, fontSize: 52,
        }}>
          ⚔
        </div>
      )}
      <span style={{ fontSize: font.sizeXL, fontWeight: 700, letterSpacing: 0.3 }}>
        {character.name || "Unnamed"}
      </span>
    </button>
  );
}

export default function CharacterSelectScreen({ characterOptions = [], onSelectCharacter }) {
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <span style={{ fontSize: font.sizeLG, fontWeight: 700, color: colors.textPrimary, margin: "0 auto" }}>
          Choose Your Character
        </span>
      </div>

      <div style={{ textAlign: "center", paddingTop: 28 }}>
        <p style={{ margin: 0, color: colors.textMuted, fontSize: font.sizeMD }}>
          Your choice is permanent for this run.
        </p>
      </div>

      <div style={{
        flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 48, padding: "32px 48px", flexWrap: "wrap",
      }}>
        {characterOptions.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            onSelect={() => onSelectCharacter(char.id)}
          />
        ))}
      </div>
    </div>
  );
}
