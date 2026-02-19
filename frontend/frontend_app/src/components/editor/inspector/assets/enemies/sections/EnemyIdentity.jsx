/**
 * RelicIdentity.jsx
 *
 * Inspector section responsible for editing the top-level
 * `identity` object of a Relic asset.
 *
 * JSON Shape Controlled Here (example - adjust as needed):
 * relic.identity = {
 *   name: string,
 *   rarity: "common" | "uncommon" | "rare" | "boss" | "shop",
 *   act: number
 * }
 */

import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";
import clampNumber from "../../../shared/clampNumber";

export default function RelicIdentity({ selected, update }) {
  const identity = selected.identity ?? {};

  function patchIdentity(patch) {
    update({
      identity: {
        ...identity,
        ...patch,
      },
    });
  }

  return (
    <InspectorSection title="Identity">
      <Label>Name</Label>
      <input
        value={identity.name ?? ""}
        onChange={(e) => patchIdentity({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Rarity</Label>
      <select
        value={identity.rarity ?? "common"}
        onChange={(e) => patchIdentity({ rarity: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="common">Common</option>
        <option value="uncommon">Uncommon</option>
        <option value="rare">Rare</option>
        <option value="boss">Boss</option>
        <option value="shop">Shop</option>
      </select>

      <Label>Act</Label>
      <input
        type="number"
        min={1}
        max={3}
        value={identity.act ?? 1}
        onChange={(e) =>
          patchIdentity({ act: clampNumber(e.target.value, 1, 3) })
        }
        style={{ width: "100%", padding: 10 }}
      />
    </InspectorSection>
  );
}