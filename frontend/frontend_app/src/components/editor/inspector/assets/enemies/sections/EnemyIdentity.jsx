/**
 * EnemyIdentity.jsx
 *
 * Enemy identity section.
 *
 * JSON Shape Controlled Here:
 * enemy = { name, type, startingHealth, startingBlock }
 */

import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";
import clampNumber from "../../../shared/clampNumber";

export default function EnemyIdentity({ selected, update }) {
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

      <Label>Type</Label>
      <select
        value={identity.type ?? "basic"}
        onChange={(e) => patchIdentity({ type: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="basic">Basic</option>
        <option value="elite">Elite</option>
        <option value="boss">Boss</option>
      </select>

      <Label>Starting Health</Label>
      <input
        type="number"
        min={1}
        value={identity.startingHealth ?? 1}
        onChange={(e) =>
          patchIdentity({ startingHealth: clampNumber(e.target.value, 1) })
        }
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Starting Block</Label>
      <input
        type="number"
        min={0}
        value={identity.startingBlock ?? 0}
        onChange={(e) =>
          patchIdentity({ startingBlock: clampNumber(e.target.value, 0) })
        }
        style={{ width: "100%", padding: 10 }}
      />
    </InspectorSection>
  );
}