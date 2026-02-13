/**
 * CardPreview.jsx
 * Live preview for a card asset. V1: text-based preview of all sections.
 */
export default function CardPreview({ selected }) {
  const effects = selected.effects ?? [];
  const scaling = selected.scaling ?? [];

  return (
    <div style={{ opacity: 0.9 }}>
      <div style={{ marginBottom: 12 }}>
        <div><b>{selected.name ?? "Unnamed Card"}</b></div>
        <div>
          {selected.type ?? "Attack"} • {selected.rarity ?? "Common"} • Cost {selected.cost ?? 0}
        </div>
      </div>

      <Section title="Image">
        <div>{selected.imagePath ? `Image: ${selected.imagePath}` : "No image selected"}</div>
      </Section>

      <Section title="Effects">
        {effects.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No effects</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {effects.map((e, idx) => (
              <li key={e.id ?? idx}>
                {e.effectType} {e.baseValue != null ? `(${e.baseValue})` : ""}
                {e.target ? ` → ${e.target}` : ""}
                {e.repeat ? ` x${e.repeat}` : ""}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Scaling">
        {scaling.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No scaling rules</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {scaling.map((s) => (
              <li key={s.id}>
                {s.operation} {s.amountPerUnit} per {s.basedOn} on{" "}
                {labelEffect(effects, s.appliesToEffectId)}
                {s.cap != null ? ` (cap ${s.cap})` : ""}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Rules">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <RuleTag label="Unplayable" on={Boolean(selected.unplayable)} />
          <RuleTag label="Ethereal" on={Boolean(selected.ethereal)} />
          <RuleTag label="Exhaust" on={Boolean(selected.exhaust)} />
          <RuleTag label="Innate" on={Boolean(selected.innate)} />
          <RuleTag label="Retain" on={Boolean(selected.retain)} />
        </div>
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

function RuleTag({ label, on }) {
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.15)",
        opacity: on ? 1 : 0.45,
      }}
    >
      {label}
    </span>
  );
}

function labelEffect(effects, effectId) {
  const eff = effects.find((e) => e.id === effectId);
  if (!eff) return "Unknown Effect";
  return `${eff.effectType}${eff.baseValue != null ? ` (${eff.baseValue})` : ""}`;
}