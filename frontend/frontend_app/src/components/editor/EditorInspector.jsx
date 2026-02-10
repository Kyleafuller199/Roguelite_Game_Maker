// src/components/editor/EditorInspector.jsx
import { useEditor } from "@/state/editor/useEditor";

function Label({ children }) {
  return (
    <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>
      {children}
    </label>
  );
}

function clampNumber(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export default function EditorInspector() {
  const { state, actions } = useEditor();

  const isAssetMode = state.mode === "assets";
  const hasSelection = Boolean(state.selectedId);

  if (!isAssetMode || !hasSelection) {
    return <div style={{ padding: 12 }}>Select something to edit</div>;
  }

  const { entityType, selectedId } = state;

  // Get selected entity + update function based on entityType
  let selected = null;
  let update = null;

  if (entityType === "card") {
    selected = state.assets.cards.byId[selectedId];
    update = actions.updateSelectedCard;
  } else if (entityType === "relic") {
    selected = state.assets.relics.byId[selectedId];
    update = actions.updateSelectedRelic;
  } else if (entityType === "potion") {
    selected = state.assets.potions.byId[selectedId];
    update = actions.updateSelectedPotion;
  } else if (entityType === "enemy") {
    selected = state.assets.enemies.byId[selectedId];
    update = actions.updateSelectedEnemy;
  }

  if (!selected || !update) {
    return <div style={{ padding: 12 }}>Selection not found</div>;
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Identity</div>

      {/* Name (shared) */}
      <Label>Name</Label>
      <input
        value={selected.name ?? ""}
        onChange={(e) => update({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Card fields */}
      {entityType === "card" && (
        <>
          <Label>Cost</Label>
          <input
            type="number"
            min={0}
            max={9}
            value={selected.cost ?? 0}
            onChange={(e) =>
              update({ cost: clampNumber(e.target.value, 0, 9) })
            }
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <Label>Type</Label>
          <select
            value={selected.type ?? "Attack"}
            onChange={(e) => update({ type: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          >
            <option value="Attack">Attack</option>
            <option value="Skill">Skill</option>
            <option value="Power">Power</option>
            <option value="Status">Status</option>
            <option value="Curse">Curse</option>
          </select>

          <Label>Rarity</Label>
          <select
            value={selected.rarity ?? "Common"}
            onChange={(e) => update({ rarity: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          >
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Starter">Starter</option>
            <option value="Special">Special</option>
            <option value="Curse">Curse</option>
          </select>
        </>
      )}

      {/* Relic fields */}
      {entityType === "relic" && (
        <>
          <Label>Tier</Label>
          <select
            value={selected.tier ?? "Common"}
            onChange={(e) => update({ tier: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          >
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Boss">Boss</option>
            <option value="Shop">Shop</option>
            <option value="Starter">Starter</option>
          </select>
        </>
      )}

      {/* Potion fields */}
      {entityType === "potion" && (
        <>
          <Label>Rarity</Label>
          <select
            value={selected.rarity ?? "Common"}
            onChange={(e) => update({ rarity: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          >
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
          </select>

          <Label>Uses</Label>
          <input
            type="number"
            min={1}
            max={9}
            value={selected.uses ?? 1}
            onChange={(e) =>
              update({ uses: clampNumber(e.target.value, 1, 9) })
            }
            style={{ width: "100%", padding: 10 }}
          />
        </>
      )}

      {/* Enemy fields */}
      {entityType === "enemy" && (
        <>
          <Label>HP</Label>
          <input
            type="number"
            min={1}
            max={999}
            value={selected.hp ?? 1}
            onChange={(e) =>
              update({ hp: clampNumber(e.target.value, 1, 999) })
            }
            style={{ width: "100%", padding: 10 }}
          />
        </>
      )}
    </div>
  );
}