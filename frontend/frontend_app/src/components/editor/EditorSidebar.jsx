// src/components/editor/EditorSidebar.jsx
import { useEditor } from "../../state/editor/EditorState";

export default function EditorSidebar() {
  const { state, actions } = useEditor();
  const isAssets = state.mode === "assets";

  const cards = state.assets.cards.allIds.map((id) => state.assets.cards.byId[id]);

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => actions.setMode("assets")}
          style={{ flex: 1, fontWeight: isAssets ? "700" : "400" }}
        >
          Assets
        </button>
        <button
          onClick={() => actions.setMode("projects")}
          style={{ flex: 1, fontWeight: !isAssets ? "700" : "400" }}
        >
          Projects
        </button>
      </div>

      {isAssets ? (
        <div>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Cards</div>

          <button
            onClick={() => actions.createCard()}
            style={{
              width: "100%",
              textAlign: "left",
              padding: 12,
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            + New Card
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cards.map((c) => {
              const selected = state.entityType === "card" && state.selectedId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => actions.selectEntity("card", c.id)}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    border: "transparent",
                    background: selected ? "#888" : "transparent",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Characters</div>
          <div style={{ opacity: 0.7 }}>Project mode coming next</div>
        </div>
      )}
    </div>
  );
}