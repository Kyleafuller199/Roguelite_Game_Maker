/**
 * EnemyIdentity.jsx
 *
 * Inspector section responsible for editing the top-level
 * `identity` object of an Enemy asset.
 *
 * JSON Shape Controlled Here:
 * enemy.identity = {
 *   name: string,
 *   enemyType: "basic" | "elite" | "boss",
 *   act: number,
 *   maxHealth: number,
 *   startingBlock: number
 * }
 *
 * Responsibility:
 * - Reads current identity values from `selected`
 * - Updates only the `identity` branch using a shallow merge
 * - Enforces numeric constraints via clampNumber
 */

import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

export default function EnemyIdentity({ selected, update }) {
  // Ensure identity always exists to prevent undefined access
  const identity = selected.identity ?? {};

  /**
   * patchIdentity
   *
   * Merges partial updates into the existing identity object.
   * Prevents overwriting unrelated identity fields.
   */
  function patchIdentity(patch) {
    update({
      identity: {
        ...identity,
        ...patch,
      },
    });
  }

  return (
    <div>
      {/* Section Title */}
      <div style={{ fontWeight: 700, marginBottom: 12 }}>
        Identity
      </div>

      {/* Name */}
      <Label>Name</Label>
      <input
        value={identity.name ?? ""}
        onChange={(e) =>
          patchIdentity({ name: e.target.value })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Enemy Type Classification */}
      <Label>Type</Label>
      <select
        value={identity.enemyType ?? "basic"}
        onChange={(e) =>
          patchIdentity({ enemyType: e.target.value })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="basic">Basic</option>
        <option value="elite">Elite</option>
        <option value="boss">Boss</option>
      </select>

      {/* Act (Game Progression Tier) */}
      <Label>Act</Label>
      <input
        type="number"
        min={1}
        max={3}
        value={identity.act ?? 1}
        onChange={(e) =>
          patchIdentity({
            act: clampNumber(e.target.value, 1, 3),
          })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Maximum Health Pool */}
      <Label>Max Health</Label>
      <input
        type="number"
        min={1}
        max={999}
        value={identity.maxHealth ?? 40}
        onChange={(e) =>
          patchIdentity({
            maxHealth: clampNumber(e.target.value, 1, 999),
          })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Starting Block (initial defense value) */}
      <Label>Starting Block</Label>
      <input
        type="number"
        min={0}
        max={999}
        value={identity.startingBlock ?? 0}
        onChange={(e) =>
          patchIdentity({
            startingBlock: clampNumber(e.target.value, 0, 999),
          })
        }
        style={{ width: "100%", padding: 10 }}
      />
    </div>
  );
}