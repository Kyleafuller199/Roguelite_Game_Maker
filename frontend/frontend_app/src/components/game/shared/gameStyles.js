/**
 * gameStyles.js
 *
 * Shared constants and inline-style objects for all game/play screens.
 * Color tokens are sourced from the central theme so editor and game
 * surfaces stay visually consistent.
 */

import { colors, font, radius } from "@/styles/theme";

// Re-export tokens so game components can import everything they need
// from this one file rather than going directly to theme.js.
export { colors, font, radius };

export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export const SCENE_BG = {
  battle:   "scenes/battle/combat.png",
  elite:    "scenes/battle/combat.png",
  boss:     "scenes/battle/combat.png",
  rest:     "scenes/rest/rest.png",
  treasure: "scenes/treasure/treasure.png",
  event:    "scenes/treasure/treasure.png",
};

export const styles = {
  page: {
    height: "100vh", display: "flex", flexDirection: "column",
    background: colors.pageBg, color: colors.textPrimary,
    fontFamily: font.family, overflow: "hidden",
  },
  topBar: {
    height: 48, display: "flex", alignItems: "center", gap: 12,
    padding: "0 20px",
    borderBottom: `1px solid ${colors.borderSubtle}`,
    flexShrink: 0,
    background: "rgba(0,0,0,0.4)",
  },
  btn: {
    background: "transparent",
    border: `1px solid ${colors.borderMedium}`,
    borderRadius: radius.md, color: colors.textMuted,
    padding: "4px 12px", cursor: "pointer", fontSize: font.sizeMD,
  },
  center: {
    height: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    color: colors.textPrimary, fontFamily: font.family, gap: 12,
  },
  statBox: {
    background: colors.overlayBg,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: radius.xl, padding: "10px 14px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
  },
  blockBadge: {
    fontSize: font.sizeSM, color: colors.blue,
    background: "rgba(126,200,227,0.1)",
    border: "1px solid rgba(126,200,227,0.2)",
    borderRadius: radius.md, padding: "2px 8px",
  },
  sprite: {
    maxWidth: 270, maxHeight: 330, objectFit: "contain",
  },
  hand: {
    height: 220, background: "transparent",
    display: "flex", alignItems: "center",
    padding: "0 16px", gap: 10, flexShrink: 0,
  },
  cardRow: {
    flex: 1, display: "flex", gap: 8, overflowX: "auto",
    alignItems: "flex-end", paddingBottom: 4,
  },
  endTurnBtn: {
    height: 110, width: 90, flexShrink: 0,
    background: colors.green, border: "none",
    borderRadius: radius.lg, color: colors.textPrimary,
    fontWeight: 700, fontSize: font.sizeLG,
    cursor: "pointer", textAlign: "center", lineHeight: 1.3,
  },
  continueBtn: {
    padding: "10px 28px", background: colors.green,
    border: "none", borderRadius: radius.lg,
    color: colors.textPrimary, fontWeight: 700,
    fontSize: font.sizeLG, cursor: "pointer",
  },
};
