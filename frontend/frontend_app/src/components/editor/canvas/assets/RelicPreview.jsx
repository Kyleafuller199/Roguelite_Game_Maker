/**
 * RelicPreview.jsx
 * Live preview for a relic asset. V1: text-based preview of all sections.
 */
export default function RelicPreview({ selected }) {
  const identity = selected.identity ?? {};
  const effects = selected.effects ?? [];
  const triggers = selected.triggers ?? [];
  const imageUrl = selected.imageUrl ?? "";

  return (
    <div style={{ opacity: 0.9 }}>
      <div style={{ marginBottom: 12 }}>
        <div>
          <b>{identity.name ?? selected.name ?? "Unnamed Relic"}</b>
        </div>
        <div>Rarity: {identity.rarity ?? selected.tier ?? "Common"}</div>
      </div>

      <Section title="Image">
        <div>{imageUrl ? `Image: ${imageUrl}` : "No image selected"}</div>
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

      <Section title="Triggers">
        {triggers.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No triggers</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {triggers.map((t) => (
              <li key={t.id}>
                <div>
                  <b>{t.event ?? "unknownEvent"}</b>
                </div>
                <div style={{ opacity: 0.85 }}>
                  {renderTriggerEffects(effects, t.effectIds)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function renderTriggerEffects(effects, effectIds) {
  const ids = effectIds ?? [];
  if (ids.length === 0) return "No bound effects";

  const labels = ids.map((id) => labelEffect(effects, id));
  return labels.join(", ");
}

function labelEffect(effects, effectId) {
  const eff = (effects ?? []).find((e) => e.id === effectId);
  if (!eff) return "Unknown Effect";
  return `${eff.effectType}${eff.baseValue != null ? ` (${eff.baseValue})` : ""}${
    eff.target ? ` → ${eff.target}` : ""
  }${eff.repeat ? ` x${eff.repeat}` : ""}`;
}