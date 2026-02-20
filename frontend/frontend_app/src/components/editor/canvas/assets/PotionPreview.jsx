/**
 * PotionPreview.jsx
 * Live preview for a potion asset. V1: text-based preview of all sections.
 */

import CanvasSection from "@/components/editor/canvas/CanvasSection";
import {
  canvasEntityName,
  canvasEntityMeta,
  canvasBodyText,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/canvas/canvasStyles";

export default function PotionPreview({ selected }) {
  const effects = selected.effects ?? [];

  return (
    <div>
      {/* Identity Section */}
      <div style={{ marginBottom: 12 }}>
        <div style={canvasEntityName}>
          {selected.identity?.name ?? selected.name ?? "Unnamed Potion"}
        </div>
        <div style={canvasEntityMeta}>
          {selected.identity?.rarity ?? selected.rarity ?? "Common"} •{" "}
          {labelUseContext(selected.identity?.useContext)}
        </div>
      </div>

      {/* Image Section */}
      <CanvasSection title="Image">
        <div>
          {selected.imageUrl ? `Image: ${selected.imageUrl}` : "No image selected"}
        </div>
      </CanvasSection>

      {/* Effects Section */}
      <CanvasSection title="Effects">
        {effects.length === 0 ? (
          <div style={{ color: COLOR_TEXT_SECONDARY }}>No effects</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, ...canvasBodyText }}>
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
      </CanvasSection>
    </div>
  );
}

/* ---------- helpers ---------- */

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
