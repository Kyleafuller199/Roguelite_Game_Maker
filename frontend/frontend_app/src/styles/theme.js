/**
 * theme.js
 *
 * Single source of truth for all design tokens across the Roguelite Game Maker.
 * Both the editor (sidebarStyles / canvasStyles) and the game play screens
 * (gameStyles) import from here so colours and type scales stay in sync.
 */

// ── Colour palette ────────────────────────────────────────────────────────────

export const colors = {
  // ── Backgrounds ──
  pageBg:       "#0f0a06",   // game screen root background
  editorBg:     "#383838",   // editor panel / AppHeader background
  canvasBg:     "#181716",   // editor canvas / selected-item background
  surfaceBg:    "#1a1918",   // card pile modal, tooltip backgrounds
  overlayBg:    "rgba(0,0,0,0.65)", // stat boxes, in-scene panels
  hoverBg:      "#454545",   // editor sidebar hover state

  // ── Text ──
  textPrimary:   "#e5e5e5",
  textSecondary: "#b3b3b3",
  textMuted:     "#888888",
  textDim:       "#666666",
  textDisabled:  "#555555",

  // ── Accents ──
  gold:   "#f0c030",   // victory banner, energy, relics
  green:  "#226635",   // continue / end-turn / Start Run
  red:    "#c0392b",   // defeat, danger
  blue:   "#7ec8e3",   // block badges
  orange: "#e57c3a",   // enemy intent, strength badge

  // ── Status effects ──
  statusStrength:   "#e57c3a",
  statusWeak:       "#7ec8e3",
  statusVulnerable: "#c0392b",
  statusFrail:      "#999999",

  // ── Card types ──
  cardAttack:  "#c0392b",
  cardSkill:   "#27ae60",
  cardPower:   "#8e44ad",
  cardCurse:   "#6d3d7a",

  // ── Borders ──
  borderSubtle: "rgba(255,255,255,0.06)",
  borderLight:  "rgba(255,255,255,0.10)",
  borderMedium: "rgba(255,255,255,0.15)",
  borderStrong: "rgba(255,255,255,0.30)",
};

// ── Typography ────────────────────────────────────────────────────────────────

export const font = {
  family: "Inter, sans-serif",
  sizeXS:  9,
  sizeSM: 11,
  sizeMD: 13,
  sizeLG: 14,
  sizeXL: 16,
  sizeH2: 20,
};

// ── Border radius ─────────────────────────────────────────────────────────────

export const radius = {
  sm:  4,
  md:  6,
  lg:  8,
  xl: 10,
  xxl: 14,
};
