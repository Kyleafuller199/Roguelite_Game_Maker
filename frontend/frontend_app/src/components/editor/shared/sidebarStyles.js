/**
 * sidebarStyles.js
 *
 * Shared design tokens and style-builder helpers for all editor sidebar
 * surfaces (EditorSidebar, AssetSidebar, ProjectSidebar).
 *
 * Centralising colours and layout values here means a single change
 * propagates across every sidebar surface.
 */

// ── Colour tokens ─────────────────────────────────────────────────────────────

/** Background fill for selected entities (active toggle button, selected list items, etc.) */
export const COLOR_SELECTED_BG    = "#181716";

/** Primary text colour — used on selected / active elements */
export const COLOR_TEXT_MAIN      = "#e5e5e5";

/** Secondary text colour — used on idle / non-selected elements */
export const COLOR_TEXT_SECONDARY = "#b3b3b3";

/** Sidebar panel background */
export const COLOR_SIDEBAR_BG     = "#383838";

/** Background applied on pointer-hover */
export const COLOR_HOVER_BG       = "#454545";

// ── Layout objects ────────────────────────────────────────────────────────────

/**
 * Outer sidebar container.
 * Apply to the root element of EditorSidebar or any sidebar panel.
 */
export const sidebarContainer = {
  width: 240,
  minWidth: 240,
  height: "100%",
  backgroundColor: COLOR_SIDEBAR_BG,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  boxSizing: "border-box",
  overflow: "hidden",
};

/**
 * Sticky header section pinned to the top of the sidebar.
 * Contains the mode toggle and secondary action item.
 */
export const stickySection = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 12,
  backgroundColor: COLOR_SIDEBAR_BG,
  boxSizing: "border-box",
  flexShrink: 0,
};

/**
 * Wrapper for the two-button mode toggle.
 * Provides the shared border outline and clips button corners.
 */
export const toggleRow = {
  display: "flex",
  width: "100%",
  height: 40,
  border: `1px solid ${COLOR_SELECTED_BG}`,
  borderRadius: 8,
  overflow: "hidden",
  boxSizing: "border-box",
};

// ── Style factory functions ───────────────────────────────────────────────────

/**
 * Universal sidebar button style.
 * Used by all asset list items and sticky-section buttons.
 *
 * - Width: fill container
 * - Height: 40px
 * - Border radius: 8px
 * - Idle bg: transparent  |  Hover bg: COLOR_HOVER_BG  |  Selected bg: COLOR_SELECTED_BG
 *
 * @param {boolean} isSelected  Whether this button is the active / selected state
 * @param {boolean} isHovered   Whether the pointer is currently over this button
 * @returns {React.CSSProperties}
 */
export function sidebarButtonStyle(isSelected, isHovered) {
  const bg = isSelected
    ? COLOR_SELECTED_BG
    : isHovered ? COLOR_HOVER_BG : "transparent";

  return {
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    background: bg,
    border: "none",
    borderRadius: 8,
    paddingLeft: 12,
    color: isSelected ? COLOR_TEXT_MAIN : COLOR_TEXT_SECONDARY,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: isSelected ? 600 : 500,
    textAlign: "left",
    boxSizing: "border-box",
  };
}

// ── Section header / body ─────────────────────────────────────────────────────

/**
 * Collapsible section header row.
 * Height 40, bg #454545, horizontal padding 8.
 * Title and chevron are laid out with space-between; chevron sits on the right.
 */
export const sectionHeader = {
  height: 40,
  backgroundColor: COLOR_HOVER_BG,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: 8,
  paddingRight: 8,
  cursor: "pointer",
  userSelect: "none",
  boxSizing: "border-box",
};

/** Section header title — semibold 14px, primary colour */
export const sectionHeaderTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: COLOR_TEXT_MAIN,
};

/** Section header chevron — primary colour, sits on the right */
export const sectionHeaderChevron = {
  fontSize: 20,
  color: COLOR_TEXT_MAIN,
};

/**
 * Collapsible section body that wraps list items.
 * Padding 12 all around, gap 4 between items.
 */
export const sectionBody = {
  display: "flex",
  flexDirection: "column",
  padding: 12,
  gap: 4,
};

/**
 * Mode-toggle button style (Assets / Projects).
 * Extends sidebarButtonStyle — overrides width to flex-fill the toggle row
 * and centers the label. Border-radius is removed because the toggleRow
 * container clips the corners instead.
 *
 * @param {boolean} isSelected  Whether this button represents the active mode
 * @param {boolean} isHovered   Whether the pointer is currently over this button
 * @returns {React.CSSProperties}
 */
export function toggleButtonStyle(isSelected, isHovered) {
  return {
    ...sidebarButtonStyle(isSelected, isHovered),
    flex: 1,
    width: undefined,
    borderRadius: 0,
    paddingLeft: 0,
    justifyContent: "center",
  };
}
