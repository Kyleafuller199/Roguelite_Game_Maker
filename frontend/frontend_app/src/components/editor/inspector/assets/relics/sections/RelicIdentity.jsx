/**
 * RelicIdentitySection.jsx
 *
 * Inspector section responsible for editing `relic.identity`.
 *
 * JSON Shape Controlled Here:
 * relic.identity = {
 *   name: string,
 *   rarity: "Common" | "Uncommon" | "Rare" | "Boss" | "Shop"
 * }
 *
 * Responsibility:
 * - Reads identity values from `selected`
 * - Applies shallow patches to the identity branch
 * - Prevents overwriting unrelated identity fields
 *
 * Important:
 * - The parent `update()` function performs a shallow merge at the relic level.
 * - Therefore, this section must merge `identity` locally before calling update.
 */

import Label from "../../../shared/Label";

export default function RelicIdentity({ selected, update }) {
  // Ensure identity object exists for stable controlled inputs
  const identity = selected.identity ?? {
    name: "",
    rarity: "Common",
  };

  /**
   * updateIdentity
   * Merges partial updates into the identity object
   * to avoid wiping other identity properties.
   */
  function updateIdentity(patch) {
    update({
      identity: {
        ...identity,
        ...patch,
      },
    });
  }

  return (
    <>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Identity</div>

      {/* Name */}
      <Label>Name</Label>
      <input
        value={identity.name ?? ""}
        onChange={(e) => updateIdentity({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Rarity classification (affects drop pools, balance, etc.) */}
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