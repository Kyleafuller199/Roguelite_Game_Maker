/**
 * RelicInspector.jsx
 * Renders relic-specific inspector fields (assets mode).
 */
import Label from "../shared/Label";

export default function RelicInspector({ selected, update }) {
  return (
    <>
      <Label>Tier</Label>
      <select
        value={selected.tier ?? "Common"}
        onChange={(e) => update({ tier: e.target.value })}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="Common">Common</option>
        <option value="Uncommon">Uncommon</option>
        <option value="Rare">Rare</option>
        <option value="Boss">Boss</option>
        <option value="Shop">Shop</option>
        <option value="Starter">Starter</option>
      </select>
    </>
  );
}