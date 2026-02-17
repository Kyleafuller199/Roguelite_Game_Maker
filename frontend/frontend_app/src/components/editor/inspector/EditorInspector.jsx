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
 * - Project mode: placeholder (to be implemented)
 */

import { useEditor } from "@/state/editor/useEditor";

import CardInspector from "@/components/editor/inspector/assets/cards/CardInspector";
import RelicInspector from "@/components/editor/inspector/assets/relics/RelicInspector";
import PotionInspector from "@/components/editor/inspector/assets/potions/PotionInspector";
import EnemyInspector from "@/components/editor/inspector/assets/enemies/EnemyInspector";

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

export default function EditorInspector() {
  const { state, actions } = useEditor();
  const { mode, entityType, selectedId } = state;

  // Placeholder until project mode inspector is implemented.
  if (mode !== "assets") {
    return <div style={{ padding: 12 }}>Select something to edit</div>;
  }

  // Asset mode requires a selection.
  if (!selectedId || !entityType) {
    return <div style={{ padding: 12 }}>Select something to edit</div>;
  }

  /**
   * Resolve:
   * - selected entity from normalized state
   * - update handler for the current entity type
   * - delete handler for the current entity type
   *
   * Later, this can be extracted into a single selector/helper in state/editor.
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
    return <div style={{ padding: 12 }}>Selection not found</div>;
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
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // Enables scroll area to size correctly in flex layouts
      }}
    >
      {/* Sticky header: remains visible while inspector sections scroll */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>
          {entityType}
          {selected?.name ? ` • ${selected.name}` : ""}
        </div>

        <button
          onClick={handleDelete}
          disabled={!onDelete}
          style={{
            padding: "6px 10px",
            cursor: onDelete ? "pointer" : "not-allowed",
          }}
        >
          Delete
        </button>
      </div>

      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, minHeight: 0 }}>
        <Inspector selected={selected} update={update} />
      </div>
    </div>
  );
}