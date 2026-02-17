/**
 * CardIdentity.jsx
 *
 * Card identity section.
 *
 * JSON Shape Controlled Here:
 * card.identity = {
 *   name: string,
 *   cost: number,
 *   cardType: "attack" | "skill" | "power" | "curse",
 *   cardRarity: "common" | "uncommon" | "rare" | "curse",
 * }
 *
 * It is stateless and relies entirely on:
 *   - `selected` (current entity snapshot)
 *   - `update` (partial update handler)
 */

import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

/**
 * CardIdentitySection
 *
 * @param {object} selected - Currently selected card entity
 * @param {Function} update - Update handler (partial patch function)
 *
 * The `update` function is expected to merge partial updates
 * into the selected card within editor state.
 */
export default function CardIdentitySection({ selected, update }) {
  return (
    <>
      {/* Section Title */}
      <div style={{ fontWeight: 700, marginBottom: 12 }}>
        Identity
      </div>

      {/* Name */}
      <Label>Name</Label>
      <input
        value={selected.name ?? ""}
        onChange={(e) => update({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Cost */}
      <Label>Cost</Label>
      <input
        type="number"
        min={0}
        max={9}
        value={selected.cost ?? 0}
        onChange={(e) =>
          update({
            cost: clampNumber(e.target.value, 0, 9),
          })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Type */}
      <Label>Type</Label>
      <select
        value={selected.type ?? "Attack"}
        onChange={(e) => update({ type: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="Attack">Attack</option>
        <option value="Skill">Skill</option>
        <option value="Power">Power</option>
        <option value="Curse">Curse</option>
      </select>

      {/* Rarity */}
      <Label>Rarity</Label>
      <select
        value={selected.rarity ?? "Common"}
        onChange={(e) => update({ rarity: e.target.value })}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
        <option value="Curse">Curse</option>
      </select>
    </>
  );
}