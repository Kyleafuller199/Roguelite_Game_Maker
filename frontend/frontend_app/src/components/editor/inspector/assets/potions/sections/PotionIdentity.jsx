/**
 * PotionIdentity.jsx
 *
 * Inspector section responsible for editing `potion.identity`.
 *
 * JSON Shape Controlled Here:
 * potion.identity = {
 *   name: string,
 *   rarity: "Common" | "Uncommon" | "Rare" | "Shop",
 *   useContext: "anyTime" | "combatOnly" | "outOfCombatOnly"
 * }
 *
 * Responsibility:
 * - Reads identity fields from `selected`
 * - Applies shallow patches to the identity object
 * - Provides controlled inputs with safe defaults
 *
 * Design Notes:
 * - Uses a local fallback object to prevent undefined access.
 * - updateIdentity() merges only the identity branch to avoid overwriting
 *   unrelated potion fields.
 */

import Label from "../../../shared/Label";

export default function PotionIdentity({ selected, update }) {
  // Ensure identity object always exists for stable controlled inputs
  const identity = selected.identity ?? {
    name: "",
    rarity: "Common",
    useContext: "anyTime",
  };

  /**
   * updateIdentity
   * Merges partial updates into the identity object.
   * Prevents accidental loss of other identity fields.
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
        <option value="Shop">Shop</option>
      </select>

      {/* When the potion can be used in gameplay */}
      <Label>Use Context</Label>
      <select
        value={identity.useContext ?? "anyTime"}
        onChange={(e) => updateIdentity({ useContext: e.target.value })}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="anyTime">Any Time</option>
        <option value="combatOnly">Combat Only</option>
        <option value="outOfCombatOnly">Out of Combat Only</option>
      </select>
    </>
  );
}