// src/components/editor/EditorSidebar.jsx
import { useMemo } from "react";
import { useEditor } from "@/state/editor/useEditor";

// Reusable section component (defined at module scope; not recreated per render)
function AssetSection({
  title,
  entityType,
  items,
  selectedEntityType,
  selectedId,
  onCreate,
  createLabel,
  onSelect,
  getItemLabel,
}) {
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
          const selected =
            selectedEntityType === entityType && selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                e.currentTarget.blur(); // prevents focus-driven scroll jump
                onSelect(entityType, item.id);
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
              {getItemLabel ? getItemLabel(item) : item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function EditorSidebar() {
  const { state, actions } = useEditor();
  const isAssets = state.mode === "assets";

  // Derive lists once per state change
  const cards = useMemo(
    () => state.assets.cards.allIds.map((id) => state.assets.cards.byId[id]),
    [state.assets.cards.allIds, state.assets.cards.byId]
  );
  const relics = useMemo(
    () => state.assets.relics.allIds.map((id) => state.assets.relics.byId[id]),
    [state.assets.relics.allIds, state.assets.relics.byId]
  );
  const potions = useMemo(
    () => state.assets.potions.allIds.map((id) => state.assets.potions.byId[id]),
    [state.assets.potions.allIds, state.assets.potions.byId]
  );
  const enemies = useMemo(
    () => state.assets.enemies.allIds.map((id) => state.assets.enemies.byId[id]),
    [state.assets.enemies.allIds, state.assets.enemies.byId]
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // allows child overflow to work in flex layouts
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
      <div style={{ flex: 1, overflowY: "auto", padding: 12, minHeight: 0 }}>
        {isAssets ? (
          <div>
            <AssetSection
              title="Cards"
              entityType="card"
              items={cards}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onCreate={actions.createCard}
              createLabel="+ New Card"
              onSelect={actions.selectEntity}
              getItemLabel={(c) => c.name ?? "Unnamed Card"}
            />

            <AssetSection
              title="Relics"
              entityType="relic"
              items={relics}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onCreate={actions.createRelic}
              createLabel="+ New Relic"
              onSelect={actions.selectEntity}
              getItemLabel={(r) => r.identity?.name ?? r.name ?? "Unnamed Relic"}
            />

            <AssetSection
              title="Potions"
              entityType="potion"
              items={potions}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onCreate={actions.createPotion}
              createLabel="+ New Potion"
              onSelect={actions.selectEntity}
              getItemLabel={(p) => p.name ?? "Unnamed Potion"}
            />

            <AssetSection
              title="Enemies"
              entityType="enemy"
              items={enemies}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onCreate={actions.createEnemy}
              createLabel="+ New Enemy"
              onSelect={actions.selectEntity}
              getItemLabel={(e) => e.name ?? "Unnamed Enemy"}
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