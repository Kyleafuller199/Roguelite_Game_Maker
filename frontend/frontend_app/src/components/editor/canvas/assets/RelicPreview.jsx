/**
 * RelicPreview.jsx
 * Live preview for a relic asset. V1: text-based preview of all sections.
 */

import CanvasSection from "@/components/editor/canvas/CanvasSection";
import {
  canvasEntityName,
  canvasEntityMeta,
  canvasBodyText,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/canvas/canvasStyles";

export default function RelicPreview({ selected }) {
  const identity = selected.identity ?? {};
  const effects = selected.effects ?? [];
  const triggers = selected.triggers ?? [];
  const imageUrl = selected.imageUrl ?? "";

  return (
    <div>
      {/* Identity header */}
      <div style={{ marginBottom: 12 }}>
        <div style={canvasEntityName}>
          {identity.name ?? selected.name ?? "Unnamed Relic"}
        </div>
        <div style={canvasEntityMeta}>
          Rarity: {identity.rarity ?? selected.tier ?? "Common"}
        </div>
      </div>

      <CanvasSection title="Image">
        <div>{imageUrl ? `Image: ${imageUrl}` : "No image selected"}</div>
      </CanvasSection>

      <CanvasSection title="Effects">
        {effects.length === 0 ? (
          <div style={{ color: COLOR_TEXT_SECONDARY }}>No effects</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, ...canvasBodyText }}>
            {effects.map((e, idx) => (
              <li key={e.id ?? idx}>
                {e.effectType} {e.baseValue != null ? `(${e.baseValue})` : ""}
                {e.target ? ` → ${e.target}` : ""}
                {e.repeat ? ` x${e.repeat}` : ""}
              </li>
            ))}
          </ul>
        )}
      </CanvasSection>

      <CanvasSection title="Triggers">
        {triggers.length === 0 ? (
          <div style={{ color: COLOR_TEXT_SECONDARY }}>No triggers</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, ...canvasBodyText }}>
            {triggers.map((t) => (
              <li key={t.id}>
                <div style={{ fontWeight: 600 }}>{t.event ?? "unknownEvent"}</div>
                <div>{renderTriggerEffects(effects, t.effectIds)}</div>
              </li>
            ))}
          </ul>
        )}
      </CanvasSection>
    </div>
  );
}

/* ---------- helpers ---------- */

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
