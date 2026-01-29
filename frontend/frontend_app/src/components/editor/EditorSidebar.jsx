// src/components/editor/EditorSidebar.jsx
import { useEditor } from "@/state/editor/EditorState";

export default function EditorSidebar() {
  const { state, actions } = useEditor();
  const isAssets = state.mode === "assets";

  const cards = state.assets.cards.allIds.map((id) => state.assets.cards.byId[id]);
  const relics = state.assets.relics.allIds.map((id) => state.assets.relics.byId[id]);
  const potions = state.assets.potions.allIds.map((id) => state.assets.potions.byId[id]);
  const enemies = state.assets.enemies.allIds.map((id) => state.assets.enemies.byId[id]);

  function AssetSection({ title, entityType, items, onCreate, createLabel }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 700 }}>{title}</div>

        <button
          onClick={onCreate}
          style={{
            width: "100%",
            textAlign: "left",
            padding: 12,
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          {createLabel}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((item) => {
            const selected = state.entityType === entityType && state.selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.currentTarget.blur(); // prevents focus-driven scroll jump
                  actions.selectEntity(entityType, item.id);
                }}                
                style={{
                  textAlign: "left",
                  padding: 12,
                  border: "transparent",
                  background: selected ? "#888" : "transparent",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // IMPORTANT: allows child overflow to work in flex layouts
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: 12,
          background: "#101013", // set to your sidebar bg
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
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
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          minHeight: 0,
        }}
      >
        {isAssets ? (
          <div>
            <AssetSection
              title="Cards"
              entityType="card"
              items={cards}
              onCreate={() => actions.createCard()}
              createLabel="+ New Card"
            />

            <AssetSection
              title="Relics"
              entityType="relic"
              items={relics}
              onCreate={() => actions.createRelic()}
              createLabel="+ New Relic"
            />

            <AssetSection
              title="Potions"
              entityType="potion"
              items={potions}
              onCreate={() => actions.createPotion()}
              createLabel="+ New Potion"
            />

            <AssetSection
              title="Enemies"
              entityType="enemy"
              items={enemies}
              onCreate={() => actions.createEnemy()}
              createLabel="+ New Enemy"
            />
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Characters</div>
            <div style={{ opacity: 0.7 }}>Project mode coming next</div>
          </div>
        )}
      </div>
    </div>
  );
}
