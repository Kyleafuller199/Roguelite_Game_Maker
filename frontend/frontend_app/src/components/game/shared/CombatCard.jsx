import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

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
  const canPlay   = energy !== undefined ? card.cost <= energy : true;
  const typeColor = TYPE_COLOR[card.type] ?? "#555";

  return (
    <button
      onClick={() => canPlay && onClick?.()}
      disabled={!canPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 120, flexShrink: 0,
        background: "#1a1816",
        border: `2px solid ${canPlay ? typeColor + "99" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 10,
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

        {/* Cost bubble — top left over the art */}
        <div style={{
          position: "absolute", top: 6, left: 6,
          width: 24, height: 24, borderRadius: 999,
          background: "#111", border: "2px solid rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "#fff",
        }}>
          {card.cost}
        </div>
      </div>

      {/* Info area */}
      <div style={{ padding: "6px 8px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#e5e5e5", lineHeight: 1.2 }}>
          {card.name}
        </span>
        <span style={{
          fontSize: 8, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.5, color: typeColor,
        }}>
          {card.type}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
          {(card.effects ?? []).map((eff, i) => (
            <span key={i} style={{ fontSize: 9, color: "#bbb", lineHeight: 1.4 }}>
              {effectDesc(eff)}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
