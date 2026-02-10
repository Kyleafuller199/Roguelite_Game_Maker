/**
 * PotionInspector.jsx
 * Renders potion-specific inspector fields (assets mode).
 */
import Label from "../shared/Label";
import clampNumber from "../shared/clampNumber";

export default function PotionInspector({ selected, update }) {
  return (
    <>
      <Label>Rarity</Label>
      <select
        value={selected.rarity ?? "Common"}
        onChange={(e) => update({ rarity: e.target.value })}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
      </select>

      <Label>Uses</Label>
      <input
        type="number"
        min={1}
        max={9}
        value={selected.uses ?? 1}
        onChange={(e) => update({ uses: clampNumber(e.target.value, 1, 9) })}
        style={{ width: "100%", padding: 10 }}
      />
    </>
  );
}