/**
 * EditorInspector.jsx
 *
 * Editor right panel renderer ("inspector" region).
 *
 * Responsibilities:
 * - Displays editable fields for the currently selected entity
 * - Routes to the correct inspector based on editor mode + entity type
 * - Provides common inspector chrome (sticky header + delete action + scroll area)
 *
 * Current behavior:
 * - Asset mode: renders an asset inspector for the selected entity
 * - Project mode: delegates to ProjectInspector for pool/character selection
 */

import { useEditor } from "@/state/editor/useEditor";

import CardInspector from "@/components/editor/inspector/assets/cards/CardInspector";
import RelicInspector from "@/components/editor/inspector/assets/relics/RelicInspector";
import PotionInspector from "@/components/editor/inspector/assets/potions/PotionInspector";
import EnemyInspector from "@/components/editor/inspector/assets/enemies/EnemyInspector";
import ProjectInspector from "@/components/editor/inspector/ProjectInspector";

import {
  COLOR_SIDEBAR_BG,
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
  COLOR_SELECTED_BG,
  sectionHeaderTitle,
} from "@/components/editor/shared/sidebarStyles";

/**
 * Inspector component lookup by entity type.
 * Keeps routing logic compact and consistent with EditorCanvas routing.
 */
const INSPECTORS = {
  card: CardInspector,
  relic: RelicInspector,
  potion: PotionInspector,
  enemy: EnemyInspector,
};

/** Shared root style — sidebar background + primary text colour. */
const rootStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  backgroundColor: COLOR_SIDEBAR_BG,
  color: COLOR_TEXT_MAIN,
};

/** Sticky header row — pinned to top, visually separates entity identity from form. */
const stickyHeaderStyle = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "0 12px",
  height: 40,
  backgroundColor: COLOR_SIDEBAR_BG,
  boxSizing: "border-box",
  flexShrink: 0,
};

/** Delete button — minimal style that fits the dark theme. */
const deleteBtnStyle = {
  padding: "2px 8px",
  fontSize: 12,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  color: COLOR_TEXT_SECONDARY,
};

export default function EditorInspector() {
  const { state, actions } = useEditor();
  const { mode, entityType, selectedId } = state;

  if (mode === "project") {
    return <ProjectInspector state={state} actions={actions} />;
  }

  // Asset mode requires a selection.
  if (!selectedId || !entityType) {
    return (
      <div style={{ ...rootStyle, padding: 12 }}>
        Select something to edit
      </div>
    );
  }

  /**
   * Resolve:
   * - selected entity from normalized state
   * - update handler for the current entity type
   * - delete handler for the current entity type
   */
  let selected = null;
  let update = null;
  let onDelete = null;

  if (entityType === "card") {
    selected = state.assets.cards.byId[selectedId];
    update = actions.updateSelectedCard;
    onDelete = actions.deleteSelectedCard;
  } else if (entityType === "relic") {
    selected = state.assets.relics.byId[selectedId];
    update = actions.updateSelectedRelic;
    onDelete = actions.deleteSelectedRelic;
  } else if (entityType === "potion") {
    selected = state.assets.potions.byId[selectedId];
    update = actions.updateSelectedPotion;
    onDelete = actions.deleteSelectedPotion;
  } else if (entityType === "enemy") {
    selected = state.assets.enemies.byId[selectedId];
    update = actions.updateSelectedEnemy;
    onDelete = actions.deleteSelectedEnemy;
  }

  const Inspector = INSPECTORS[entityType];

  // Defensive rendering for stale selections or unsupported entity types.
  if (!selected || !update || !Inspector) {
    return (
      <div style={{ ...rootStyle, padding: 12 }}>
        Selection not found
      </div>
    );
  }

  /**
   * Confirm before deleting to prevent accidental destructive actions.
   * Keeping this confirm here (in the shared inspector chrome) avoids duplication
   * across all asset inspector implementations.
   */
  function handleDelete() {
    if (!onDelete) return;
    const ok = window.confirm(`Delete this ${entityType}? This cannot be undone.`);
    if (!ok) return;
    onDelete();
  }

  return (
    <div style={rootStyle}>
      {/* Sticky header: entity identity + delete action */}
      <div style={stickyHeaderStyle}>
        <span style={sectionHeaderTitle}>
          {entityType}
          {selected?.name ? ` • ${selected.name}` : ""}
        </span>

        <button
          onClick={handleDelete}
          disabled={!onDelete}
          style={{ ...deleteBtnStyle, cursor: onDelete ? "pointer" : "not-allowed" }}
        >
          Delete
        </button>
      </div>

      {/* Scrollable inspector sections */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <Inspector selected={selected} update={update} />
      </div>
    </div>
  );
}
