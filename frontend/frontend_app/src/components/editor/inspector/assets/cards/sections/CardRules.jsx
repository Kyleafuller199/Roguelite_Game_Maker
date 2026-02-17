/**
 * CardRules.jsx
 *
 * Card rules section.
 *
 * Responsibilities:
 * - Edits simple rule flags on a card via checkbox toggles
 *
 * Data model (V1):
 * - Rule flags are stored as booleans directly on the card object:
 *   - unplayable, ethereal, exhaust, innate, retain
 *
 * Future (V2):
 * - Consider grouping these under selected.rules to better match a normalized schema 
 *   (before moving to fully normalized schema in the future).
 */

/**
 * Toggle
 *
 * Small reusable checkbox row for boolean flags.
 *
 * @param {string} label - Display label for the toggle
 * @param {boolean} checked - Current checked state
 * @param {Function} onChange - Checkbox change handler
 */
function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

/**
 * CardRules
 *
 * @param {object} selected - Currently selected card
 * @param {Function} update - Update handler (partial patch function)
 */
export default function CardRules({ selected, update }) {
  /**
   * setFlag
   *
   * Helper for updating a single boolean field on the card.
   *
   * @param {string} field - Field name to update
   * @param {boolean} value - New boolean value
   */
  function setFlag(field, value) {
    update({ [field]: value });
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Section Title */}
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