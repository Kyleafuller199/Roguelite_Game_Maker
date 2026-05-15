import { useState } from "react";
import { API_BASE, colors, font, radius } from "@/components/game/shared/gameStyles";

const TYPE_COLOR = {
  Attack: colors.cardAttack,
  Skill:  colors.cardSkill,
  Power:  colors.cardPower,
  Curse:  colors.cardCurse,
};

export function effectDesc(eff) {
  const v = eff.baseValue ?? 0;
  const r = (eff.repeat ?? 1) > 1 ? ` x${eff.repeat}` : "";
  switch (eff.effectType) {
    case "damage":     return `Deal ${v} damage${r}`;
    case "block":      return `Gain ${v} Block${r}`;
    case "heal":       return `Heal ${v} HP${r}`;
    case "weak":       return `Apply ${v} Weak${r}`;
    case "vulnerable": return `Apply ${v} Vulnerable${r}`;
    case "strength":   return `Gain ${v} Strength${r}`;
    case "draw":       return `Draw ${v} card${v !== 1 ? "s" : ""}`;
    case "gainEnergy": return `Gain ${v} Energy`;
    default:           return `${eff.effectType} ${v}${r}`;
  }
}

export default function CombatCard({ card, energy, onClick }) {
  const [hovered, setHovered] = useState(false);
  const canPlay   = energy !== undefined ? card.cost <= energy : true;
  const typeColor = TYPE_COLOR[card.type] ?? colors.textDisabled;

  return (
    <button
      onClick={() => canPlay && onClick?.()}
      disabled={!canPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 120, flexShrink: 0,
        background: colors.canvasBg,
        border: `2px solid ${canPlay ? typeColor + "99" : colors.borderSubtle}`,
        borderRadius: radius.lg,
        display: "flex", flexDirection: "column",
        opacity: canPlay ? 1 : 0.4,
        cursor: canPlay ? "pointer" : "not-allowed",
        transform: hovered && canPlay ? "translateY(-20px)" : "none",
        transition: "transform 0.15s ease",
        boxShadow: hovered && canPlay ? `0 12px 28px rgba(0,0,0,0.8), 0 0 12px ${typeColor}44` : "none",
        overflow: "hidden",
        padding: 0,
        textAlign: "left",
      }}
    >
      {/* Art area */}
      <div style={{
        height: 90, position: "relative",
        background: typeColor + "22",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {card.imageUrl ? (
          <img
            src={`${API_BASE}/api/assets/file/?path=cards/${card.imageUrl}`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        ) : (
          <span style={{ fontSize: 28, opacity: 0.2 }}>⚔</span>
        )}

        {/* Cost bubble */}
        <div style={{
          position: "absolute", top: 6, left: 6,
          width: 24, height: 24, borderRadius: 999,
          background: "#111",
          border: `2px solid ${colors.borderStrong}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: font.sizeMD, fontWeight: 800, color: colors.textPrimary,
        }}>
          {card.cost}
        </div>
      </div>

      {/* Info area */}
      <div style={{ padding: "6px 8px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: font.sizeSM, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
          {card.name}
        </span>
        <span style={{
          fontSize: font.sizeXS, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.5, color: typeColor,
        }}>
          {card.type}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
          {(card.effects ?? []).map((eff, i) => (
            <span key={i} style={{ fontSize: font.sizeXS, color: colors.textSecondary, lineHeight: 1.4 }}>
              {effectDesc(eff)}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
