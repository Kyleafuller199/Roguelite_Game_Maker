// src/components/editor/EditorCanvas.jsx
import { useEditor } from "../../state/editor/EditorState";

export default function EditorCanvas() {
  const { state } = useEditor();

  if (state.mode === "assets" && state.entityType === "card" && state.selectedId) {
    const card = state.assets.cards.byId[state.selectedId];
    if (!card) return <div style={{ padding: 16 }}>Card not found</div>;

    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Live Preview</h2>
        <div style={{ opacity: 0.8 }}>
          <div>Name: {card.name}</div>
          <div>Type: {card.type}</div>
          <div>Rarity: {card.rarity}</div>
          <div>Cost: {card.cost}</div>
        </div>
      </div>
    );
  }

  return <div style={{ padding: 16 }}>Live Preview</div>;
}
