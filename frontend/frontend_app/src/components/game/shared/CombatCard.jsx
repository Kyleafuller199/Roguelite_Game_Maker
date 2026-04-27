import { useState } from "react";

const TYPE_COLOR = { Attack: "#c0392b", Skill: "#27ae60", Power: "#8e44ad", Curse: "#6d3d7a" };

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
  const canPlay   = card.cost <= energy;
  const typeColor = TYPE_COLOR[card.type] ?? "#555";

  return (
    <button
      onClick={() => canPlay && onClick()}
      disabled={!canPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 115, flexShrink: 0,
        background: canPlay ? "#1e1c1b" : "#141210",
        border: `1px solid ${canPlay ? typeColor + "99" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 10, padding: "8px 8px 10px",
        display: "flex", flexDirection: "column", gap: 5,
        opacity: canPlay ? 1 : 0.4,
        cursor: canPlay ? "pointer" : "not-allowed",
        transform: hovered && canPlay ? "translateY(-16px)" : "none",
        transition: "transform 0.15s ease",
        boxShadow: hovered && canPlay ? "0 8px 20px rgba(0,0,0,0.7)" : "none",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 999, flexShrink: 0,
          background: "#111", border: "1px solid rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "#fff",
        }}>{card.cost}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#e5e5e5", lineHeight: 1.2 }}>
          {card.name}
        </span>
      </div>
      <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: typeColor, alignSelf: "flex-start" }}>
        {card.type}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {(card.effects ?? []).map((eff, i) => (
          <span key={i} style={{ fontSize: 9, color: "#bbb", lineHeight: 1.4 }}>
            {effectDesc(eff)}
          </span>
        ))}
      </div>
    </button>
  );
}
