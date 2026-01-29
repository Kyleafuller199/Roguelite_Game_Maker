// src/components/editor/EditorInspector.jsx
import { useEditor } from "../../state/editor/EditorState";

export default function EditorInspector() {
  const { state, actions } = useEditor();

  const isCardSelected =
    state.mode === "assets" && state.entityType === "card" && state.selectedId;

  if (!isCardSelected) {
    return <div style={{ padding: 12 }}>Select something to edit</div>;
  }

  const card = state.assets.cards.byId[state.selectedId];
  if (!card) return <div style={{ padding: 12 }}>Card not found</div>;

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Identity</div>

      <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>Name</label>
      <input
        value={card.name}
        onChange={(e) => actions.updateSelectedCard({ name: e.target.value })}
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #444" }}
      />
    </div>
  );
}
