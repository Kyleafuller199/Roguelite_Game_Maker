/**
 * PotionPreview.jsx
 * Live preview for a potion asset.
 * V1: text-based preview of identity, image, and effects.
 */

export default function PotionPreview({ selected }) {
  const effects = selected.effects ?? [];

  return (
    <div style={{ opacity: 0.9 }}>
      {/* Identity */}
      <div style={{ marginBottom: 12 }}>
        <div>
          <b>{selected.identity?.name ?? selected.name ?? "Unnamed Potion"}</b>
        </div>
        <div>
          {selected.identity?.rarity ?? selected.rarity ?? "Common"} •{" "}
          {labelUseContext(selected.identity?.useContext)}
        </div>
      </div>

      {/* Image */}
      <Section title="Image">
        <div>
          {selected.imageUrl
            ? `Image: ${selected.imageUrl}`
            : "No image selected"}
        </div>
      </Section>

      {/* Effects */}
      <Section title="Effects">
        {effects.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No effects</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {effects.map((e, idx) => (
              <li key={e.id ?? idx}>
                {e.effectType}
                {e.baseValue != null ? ` (${e.baseValue})` : ""}
                {e.target ? ` → ${e.target}` : ""}
                {e.repeat && e.repeat > 1 ? ` x${e.repeat}` : ""}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ---------- helpers ---------- */

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function labelUseContext(ctx) {
  switch (ctx) {
    case "combatOnly":
      return "Usable in Combat";
    case "outOfCombat":
      return "Usable Outside Combat";
    case "anyTime":
    default:
      return "Usable Anytime";
  }
}