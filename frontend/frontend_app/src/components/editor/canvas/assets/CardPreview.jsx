/**
 * CardPreview.jsx
 * Live preview for a card asset. V1: text-based preview of all sections.
 */

import CanvasSection from "@/components/editor/canvas/CanvasSection";
import {
  canvasEntityName,
  canvasEntityMeta,
  canvasBodyText,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/canvas/canvasStyles";

export default function CardPreview({ selected }) {
  const effects = selected.effects ?? [];
  const scaling = selected.scaling ?? [];

  return (
    <div>
      {/* Identity Section */}
      <div style={{ marginBottom: 12 }}>
        <div style={canvasEntityName}>{selected.name ?? "Unnamed Card"}</div>
        <div style={canvasEntityMeta}>
          {selected.type ?? "Attack"} • {selected.rarity ?? "Common"} • Cost{" "}
          {selected.cost ?? 0}
        </div>
      </div>

      {/* Image Section */}
      <CanvasSection title="Image">
        <div>{selected.imagePath ? `Image: ${selected.imagePath}` : "No image selected"}</div>
      </CanvasSection>

      {/* Effects Section */}
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

      {/* Scaling Section */}
      <CanvasSection title="Scaling">
        {scaling.length === 0 ? (
          <div style={{ color: COLOR_TEXT_SECONDARY }}>No scaling rules</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, ...canvasBodyText }}>
            {scaling.map((s) => (
              <li key={s.id}>
                {s.operation} {s.amountPerUnit} per {s.basedOn} on{" "}
                {labelEffect(effects, s.appliesToEffectId)}
                {s.cap != null ? ` (cap ${s.cap})` : ""}
              </li>
            ))}
          </ul>
        )}
      </CanvasSection>

      {/* Rules Section */}
      <CanvasSection title="Rules">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <RuleTag label="Unplayable" on={Boolean(selected.unplayable)} />
          <RuleTag label="Ethereal" on={Boolean(selected.ethereal)} />
          <RuleTag label="Exhaust" on={Boolean(selected.exhaust)} />
          <RuleTag label="Innate" on={Boolean(selected.innate)} />
          <RuleTag label="Retain" on={Boolean(selected.retain)} />
        </div>
      </CanvasSection>
    </div>
  );
}

/* ---------- helpers ---------- */

function RuleTag({ label, on }) {
  return (
    <span
      style={{
        fontSize: 13,
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
