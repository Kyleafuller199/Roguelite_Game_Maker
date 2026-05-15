import { useState } from "react";
import { colors, font, radius } from "@/components/game/shared/gameStyles";
import CombatCard from "./CombatCard";

export default function CardPile({ label, count, cards = [], faded = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Pile stack — clickable */}
      <button
        onClick={() => cards.length > 0 && setOpen(true)}
        style={{
          flexShrink: 0, width: 64,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 6, background: "transparent", border: "none",
          cursor: cards.length > 0 ? "pointer" : "default",
          padding: 0,
        }}
      >
        <div
          style={{
            width: 46, height: 64, borderRadius: radius.md,
            background: faded ? "#2a2018" : colors.canvasBg,
            border: `1px solid ${faded ? colors.borderSubtle : colors.borderMedium}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: font.sizeXL, fontWeight: 800,
            color: faded ? colors.textDisabled : colors.textPrimary,
            boxShadow: count > 0 ? "2px 2px 0 #111, 4px 4px 0 #0a0a0a" : "none",
            transition: "transform 0.1s",
          }}
          onMouseEnter={e => { if (cards.length > 0) e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
        >
          {count}
        </div>
        <span style={{ fontSize: font.sizeXS, color: colors.textDim, textTransform: "uppercase", letterSpacing: 1 }}>
          {label}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: colors.surfaceBg,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: radius.xxl,
              padding: "24px",
              maxWidth: "80vw",
              maxHeight: "75vh",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: font.sizeLG, fontWeight: 700, color: colors.textPrimary }}>
                {label} Pile — {count} card{count !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${colors.borderMedium}`,
                  borderRadius: radius.md, color: colors.textMuted,
                  padding: "3px 10px", cursor: "pointer", fontSize: font.sizeMD,
                }}
              >
                ✕
              </button>
            </div>

            {/* Cards grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, overflowY: "auto", justifyContent: "center" }}>
              {cards.length === 0 ? (
                <span style={{ color: colors.textDisabled, fontSize: font.sizeMD }}>Empty</span>
              ) : (
                cards.map((card, i) => (
                  <CombatCard key={`${card.id}_${i}`} card={card} energy={999} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
