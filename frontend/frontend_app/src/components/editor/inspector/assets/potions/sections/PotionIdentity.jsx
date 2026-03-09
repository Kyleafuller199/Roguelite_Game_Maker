/**
 * PotionIdentity.jsx
 *
 * Potion identity section.
 *
 * JSON Shape Controlled Here:
 * potion = { name, rarity, useContext }
 */


import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";

export default function PotionIdentity({ selected, update }) {
  const identity = selected.identity ?? { name: "", rarity: "Common", useContext: "anyTime" };

  function updateIdentity(patch) {
    update({ identity: { ...identity, ...patch } });
  }

  return (
    <InspectorSection title="Identity">
      <Label>Name</Label>
      <input
        value={identity.name ?? ""}
        onChange={(e) => updateIdentity({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Rarity</Label>
      <select
        value={identity.rarity ?? "Common"}
        onChange={(e) => updateIdentity({ rarity: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
        <option value="Shop">Shop</option>
      </select>

      <Label>Use Context</Label>
      <select
        value={identity.useContext ?? "anyTime"}
        onChange={(e) => updateIdentity({ useContext: e.target.value })}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="anyTime">Any Time</option>
        <option value="combatOnly">Combat Only</option>
      </select>
    </InspectorSection>
  );
}
