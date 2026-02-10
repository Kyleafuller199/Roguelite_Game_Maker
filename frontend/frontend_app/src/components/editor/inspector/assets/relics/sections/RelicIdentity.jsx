/**
 * RelicIdentitySection.jsx
 * Identity fields: identity.name / identity.rarity / imageId.
 */
import Label from "../../../shared/Label";

export default function RelicIdentity({ selected, update }) {
  const identity = selected.identity ?? { name: "", rarity: "Common" };

  function updateIdentity(patch) {
    // IMPORTANT: updateSelectedRelic is shallow merge
    // so we must merge identity here to avoid wiping the other field.
    update({ identity: { ...identity, ...patch } });
  }

  return (
    <>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Identity</div>

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
        <option value="Boss">Boss</option>
        <option value="Shop">Shop</option>
      </select>
    </>
  );
}