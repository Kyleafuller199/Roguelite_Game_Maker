import { useState } from "react";
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
        <div style={{
          width: 46, height: 64, borderRadius: 6,
          background: faded ? "#2a2018" : "#1e1c1b",
          border: `1px solid ${faded ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800,
          color: faded ? "#555" : "#e5e5e5",
          boxShadow: count > 0 ? "2px 2px 0 #111, 4px 4px 0 #0a0a0a" : "none",
          transition: "transform 0.1s",
          transform: "none",
        }}
        onMouseEnter={e => { if (cards.length > 0) e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
        >
          {count}
        </div>
        <span style={{ fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
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
              background: "#1a1918",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
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
              <span style={{ fontSize: 15, fontWeight: 700, color: "#e5e5e5" }}>
                {label} Pile — {count} card{count !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 6, color: "#aaa", padding: "3px 10px",
                  cursor: "pointer", fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>

            {/* Cards grid */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              overflowY: "auto",
              justifyContent: "center",
            }}>
              {cards.length === 0 ? (
                <span style={{ color: "#555", fontSize: 13 }}>Empty</span>
              ) : (
                cards.map((card, i) => (
                  <CombatCard
                    key={`${card.id}_${i}`}
                    card={card}
                    energy={999}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
