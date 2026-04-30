// Shared constants and styles used across all game screens

export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export const SCENE_BG = {
  battle:   "scenes/battle/combat.png",
  elite:    "scenes/battle/combat.png",
  boss:     "scenes/battle/combat.png",
  rest:     "scenes/rest/rest.png",
  treasure: "scenes/treasure/treasure.png",
  event:    "scenes/treasure/treasure.png", // placeholder until an event scene is added
};

export const styles = {
  page: {
    height: "100vh", display: "flex", flexDirection: "column",
    background: "#0f0a06", color: "#e5e5e5",
    fontFamily: "Inter, sans-serif", overflow: "hidden",
  },
  topBar: {
    height: 48, display: "flex", alignItems: "center", gap: 12,
    padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
    background: "rgba(0,0,0,0.4)",
  },
  btn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 6, color: "#aaa", padding: "4px 12px", cursor: "pointer", fontSize: 12,
  },
  center: {
    height: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    color: "#e5e5e5", fontFamily: "Inter, sans-serif", gap: 12,
  },
  statBox: {
    background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "10px 14px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
  },
  blockBadge: {
    fontSize: 11, color: "#7ec8e3",
    background: "rgba(126,200,227,0.1)", border: "1px solid rgba(126,200,227,0.2)",
    borderRadius: 6, padding: "2px 8px",
  },
  sprite: {
    maxWidth: 270, maxHeight: 330, objectFit: "contain",
  },
  hand: {
    height: 220, background: "transparent",
    display: "flex", alignItems: "center", padding: "0 16px", gap: 10, flexShrink: 0,
  },
  cardRow: {
    flex: 1, display: "flex", gap: 8, overflowX: "auto",
    alignItems: "flex-end", paddingBottom: 4,
  },
  endTurnBtn: {
    height: 110, width: 90, flexShrink: 0,
    background: "#226635", border: "none", borderRadius: 10,
    color: "#fff", fontWeight: 700, fontSize: 14,
    cursor: "pointer", textAlign: "center", lineHeight: 1.3,
  },
  continueBtn: {
    padding: "10px 28px", background: "#226635",
    border: "none", borderRadius: 8, color: "#fff",
    fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
};
