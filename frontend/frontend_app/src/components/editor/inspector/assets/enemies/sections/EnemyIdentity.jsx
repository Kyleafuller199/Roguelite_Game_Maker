/**
 * EnemyIdentity.jsx
 * Identity fields: name/type/act/maxHealth/startingBlock.
 */
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

export default function EnemyIdentity({ selected, update }) {
  const identity = selected.identity ?? {};

  function patchIdentity(patch) {
    update({ identity: { ...identity, ...patch } });
  }

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Identity</div>

      <Label>Name</Label>
      <input
        value={identity.name ?? ""}
        onChange={(e) => patchIdentity({ name: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Type</Label>
      <select
        value={identity.enemyType ?? "basic"}
        onChange={(e) => patchIdentity({ enemyType: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="basic">Basic</option>
        <option value="elite">Elite</option>
        <option value="boss">Boss</option>
      </select>

      <Label>Act</Label>
      <input
        type="number"
        min={1}
        max={3}
        value={identity.act ?? 1}
        onChange={(e) => patchIdentity({ act: clampNumber(e.target.value, 1, 3) })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Max Health</Label>
      <input
        type="number"
        min={1}
        max={999}
        value={identity.maxHealth ?? 40}
        onChange={(e) => patchIdentity({ maxHealth: clampNumber(e.target.value, 1, 999) })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <Label>Starting Block</Label>
      <input
        type="number"
        min={0}
        max={999}
        value={identity.startingBlock ?? 0}
        onChange={(e) => patchIdentity({ startingBlock: clampNumber(e.target.value, 0, 999) })}
        style={{ width: "100%", padding: 10 }}
      />
    </div>
  );
}