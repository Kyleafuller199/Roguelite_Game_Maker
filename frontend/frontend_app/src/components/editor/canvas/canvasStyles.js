/**
 * canvasStyles.js
 *
 * Shared design tokens and style helpers for all editor canvas surfaces
 * (EditorCanvas, CardPreview, RelicPreview, PotionPreview, EnemyPreview).
 *
 * Imports colour tokens from sidebarStyles so the two surfaces stay in sync.
 */

import {
  COLOR_SELECTED_BG,
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/shared/sidebarStyles";

export { COLOR_SELECTED_BG, COLOR_TEXT_MAIN, COLOR_TEXT_SECONDARY };

// ── Canvas container ──────────────────────────────────────────────────────────

/** Root canvas panel — fills available space with the selected-item background. */
export const canvasContainer = {
  flex: 1,
  height: "100%",
  backgroundColor: COLOR_SELECTED_BG,
  padding: 16,
  boxSizing: "border-box",
  overflowY: "auto",
  color: COLOR_TEXT_MAIN,
};

// ── Section header / body ─────────────────────────────────────────────────────

/** Section header title — 14px semibold, primary colour. */
export const canvasSectionTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: COLOR_TEXT_MAIN,
  marginBottom: 6,
};

/** Section body text and list items — 13px, secondary colour. */
export const canvasBodyText = {
  fontSize: 13,
  color: COLOR_TEXT_SECONDARY,
};

// ── Entity identity header (top of each preview) ──────────────────────────────

/** Primary name line — 14px semibold, primary colour. */
export const canvasEntityName = {
  fontSize: 14,
  fontWeight: 600,
  color: COLOR_TEXT_MAIN,
};

/** Subtitle / meta line — 13px, secondary colour. */
export const canvasEntityMeta = {
  fontSize: 13,
  color: COLOR_TEXT_SECONDARY,
};
