/**
 * EditorInspector.jsx
 * Renders the inspector panel for the currently selected entity.
 * (Currently: asset mode only; project mode comes later.)
 */
import { useEditor } from "@/state/editor/useEditor";

import CardInspector from "@/components/editor/inspector/assets/cards/CardInspector";
import RelicInspector from "@/components/editor/inspector/assets/relics/RelicInspector";
import PotionInspector from "@/components/editor/inspector/assets//potions/PotionInspector";
import EnemyInspector from "@/components/editor/inspector/assets/EnemyInspector";

// Maps entity types to their inspector components
const INSPECTORS = {
  card: CardInspector,
  relic: RelicInspector,
  potion: PotionInspector,
  enemy: EnemyInspector,
};

export default function EditorInspector() {
  const { state, actions } = useEditor();

  const isAssetMode = state.mode === "assets";
  const hasSelection = Boolean(state.selectedId);

  if (!isAssetMode || !hasSelection) {
    return <div style={{ padding: 12 }}>Select something to edit</div>;
  }

  const { entityType, selectedId } = state;

  // Resolve selected entity + update handler + delete handler
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

  if (!selected || !update || !Inspector) {
    return <div style={{ padding: 12 }}>Selection not found</div>;
  }

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
        minHeight: 0,
      }}
    >
      {/* Sticky header */}
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

      {/* Scroll area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, minHeight: 0 }}>
        <Inspector selected={selected} update={update} />
      </div>
    </div>
  );
}