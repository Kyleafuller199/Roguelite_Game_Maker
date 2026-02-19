/**
 * CardRules.jsx
 *
 * Card rules section — boolean flag toggles.
 *
 * Data model (V1): unplayable, ethereal, exhaust, innate, retain stored as booleans.
 */

import InspectorSection from "../../../shared/InspectorSection";

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export default function CardRules({ selected, update }) {
  function setFlag(field, value) {
    update({ [field]: value });
  }

  return (
    <InspectorSection title="Rules">
      <Toggle
        label="Unplayable"
        checked={Boolean(selected.unplayable)}
        onChange={(e) => setFlag("unplayable", e.target.checked)}
      />
      <Toggle
        label="Ethereal"
        checked={Boolean(selected.ethereal)}
        onChange={(e) => setFlag("ethereal", e.target.checked)}
      />
      <Toggle
        label="Exhaust"
        checked={Boolean(selected.exhaust)}
        onChange={(e) => setFlag("exhaust", e.target.checked)}
      />
      <Toggle
        label="Innate"
        checked={Boolean(selected.innate)}
        onChange={(e) => setFlag("innate", e.target.checked)}
      />
      <Toggle
        label="Retain"
        checked={Boolean(selected.retain)}
        onChange={(e) => setFlag("retain", e.target.checked)}
      />
    </InspectorSection>
  );
}
