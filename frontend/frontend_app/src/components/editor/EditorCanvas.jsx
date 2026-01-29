// src/components/editor/EditorCanvas.jsx
import { useEditor } from "@/state/editor/EditorState";

export default function EditorCanvas() {
  const { state } = useEditor();

  if (state.mode !== "assets" || !state.selectedId) {
    return <div style={{ padding: 16 }}>Live Preview</div>;
  }

  const { entityType, selectedId } = state;

  let selected = null;

  if (entityType === "card") selected = state.assets.cards.byId[selectedId];
  else if (entityType === "relic") selected = state.assets.relics.byId[selectedId];
  else if (entityType === "potion") selected = state.assets.potions.byId[selectedId];
  else if (entityType === "enemy") selected = state.assets.enemies.byId[selectedId];

  if (!selected) return <div style={{ padding: 16 }}>Selection not found</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Live Preview</h2>

      {entityType === "card" && (
        <div style={{ opacity: 0.8 }}>
          <div>Name: {selected.name}</div>
          <div>Type: {selected.type}</div>
          <div>Rarity: {selected.rarity}</div>
          <div>Cost: {selected.cost}</div>
        </div>
      )}

      {entityType === "relic" && (
        <div style={{ opacity: 0.8 }}>
          <div>Name: {selected.name}</div>
          <div>Tier: {selected.tier}</div>
        </div>
      )}

      {entityType === "potion" && (
        <div style={{ opacity: 0.8 }}>
          <div>Name: {selected.name}</div>
          <div>Rarity: {selected.rarity}</div>
          <div>Uses: {selected.uses}</div>
        </div>
      )}

      {entityType === "enemy" && (
        <div style={{ opacity: 0.8 }}>
          <div>Name: {selected.name}</div>
          <div>HP: {selected.hp}</div>
        </div>
      )}
    </div>
  );
}