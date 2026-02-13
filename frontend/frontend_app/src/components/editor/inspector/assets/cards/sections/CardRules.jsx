/**
 * CardRules.jsx
 * Rules section: simple toggles for rule flags on a card.
 * V1: stores booleans directly on the card object (later: move under card.rules).
 */

function Toggle({ label, checked, onChange }) {
    return (
      <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span>{label}</span>
      </label>
    );
  }
  
  export default function CardRules({ selected, update }) {
    // Helper: update a single boolean flag on the card
    function setFlag(field, value) {
      update({ [field]: value });
    }
  
    return (
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Rules</div>
  
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
      </div>
    );
  }