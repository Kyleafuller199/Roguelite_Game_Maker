/**
 * EnemyInspector.jsx
 * Renders enemy-specific inspector fields (assets mode).
 */
import Label from "../shared/Label";
import clampNumber from "../shared/clampNumber";

export default function EnemyInspector({ selected, update }) {
  return (
    <>
      <Label>HP</Label>
      <input
        type="number"
        min={1}
        max={999}
        value={selected.hp ?? 1}
        onChange={(e) => update({ hp: clampNumber(e.target.value, 1, 999) })}
        style={{ width: "100%", padding: 10 }}
      />
    </>
  );
}