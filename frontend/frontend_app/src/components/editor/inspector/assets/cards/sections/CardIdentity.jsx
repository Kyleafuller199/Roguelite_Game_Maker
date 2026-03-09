/**
 * CardIdentity.jsx
 *
 * Card identity section.
 *
 * JSON Shape Controlled Here:
 * card = { name, cost, type, rarity }
 */

import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";
import clampNumber from "../../../shared/clampNumber";

export default function CardIdentitySection({ selected, update }) {
  return (
    <InspectorSection title="Identity">
      <Label>Name</Label>
      <input
        value={selected.name ?? ""}
        onChange={(e) => update({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Cost</Label>
      <input
        type="number"
        min={0}
        max={9}
        value={selected.cost ?? 0}
        onChange={(e) => update({ cost: clampNumber(e.target.value, 0, 9) })}
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
        <option value="Curse">Curse</option>
      </select>

      <Label>Rarity</Label>
      <select
        value={selected.rarity ?? "Common"}
        onChange={(e) => update({ rarity: e.target.value })}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="Starter">Starter</option>
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
        <option value="Curse">Curse</option>
      </select>
    </InspectorSection>
  );
}
