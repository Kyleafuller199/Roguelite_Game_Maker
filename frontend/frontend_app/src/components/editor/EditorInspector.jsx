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

      {/* Name */}
      <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>
        Name
      </label>
      <input
        value={card.name}
        onChange={(e) => actions.updateSelectedCard({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Cost */}
      <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>
        Cost
      </label>
      <input
        type="number"
        min={0}
        max={9}
        value={card.cost}
        onChange={(e) =>
          actions.updateSelectedCard({
            cost: Math.max(0, Math.min(9, Number(e.target.value))),
          })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Type */}
      <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>
        Type
      </label>
      <select
        value={card.type}
        onChange={(e) => actions.updateSelectedCard({ type: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="Attack">Attack</option>
        <option value="Skill">Skill</option>
        <option value="Power">Power</option>
        <option value="Status">Status</option>
      </select>

      {/* Rarity */}
      <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>
        Rarity
      </label>
      <select
        value={card.rarity}
        onChange={(e) => actions.updateSelectedCard({ rarity: e.target.value })}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
        <option value="Curse">Curse</option>
      </select>
    </div>
  );
}
