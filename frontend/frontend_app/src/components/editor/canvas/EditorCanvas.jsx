/**
 * EditorCanvas.jsx
 *
 * Editor center panel renderer ("canvas" region).
 *
 * Responsibilities:
 * - Displays the live preview for the currently selected entity
 * - Routes preview rendering based on editor mode + selected entity type
 *
 * Current behavior:
 * - Asset mode: shows live preview for selected asset
 * - Project mode: placeholder (to be implemented)
 */

import { useEditor } from "@/state/editor/useEditor";

import CardPreview from "@/components/editor/canvas/assets/CardPreview";
import RelicPreview from "@/components/editor/canvas/assets/RelicPreview";
import PotionPreview from "@/components/editor/canvas/assets/PotionPreview";
import EnemyPreview from "@/components/editor/canvas/assets/EnemyPreview";

/**
 * Preview component lookup by entity type.
 * Keeps the render logic compact and avoids repeated conditionals.
 */
const PREVIEWS = {
  card: CardPreview,
  relic: RelicPreview,
  potion: PotionPreview,
  enemy: EnemyPreview,
};

export default function EditorCanvas() {
  const { state } = useEditor();
  const { mode, entityType, selectedId } = state;

  // Placeholder until project mode canvas is implemented.
  if (mode !== "assets") {
    return <div style={{ padding: 16 }}>Live Preview</div>;
  }

  // Asset mode requires a selection to preview.
  if (!selectedId || !entityType) {
    return <div style={{ padding: 16 }}>Live Preview</div>;
  }

  /**
   * Resolve the selected asset from normalized state by entity type.
   * This is intentionally explicit for clarity; later you can extract a selector:
   *   getSelectedEntity(state)
   */
  let selected = null;

  if (entityType === "card") selected = state.assets.cards.byId[selectedId];
  else if (entityType === "relic") selected = state.assets.relics.byId[selectedId];
  else if (entityType === "potion") selected = state.assets.potions.byId[selectedId];
  else if (entityType === "enemy") selected = state.assets.enemies.byId[selectedId];

  const Preview = PREVIEWS[entityType];

  // Defensive rendering for stale selections or unsupported entity types.
  if (!selected || !Preview) {
    return <div style={{ padding: 16 }}>Selection not found</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Live Preview</h2>
      <Preview selected={selected} />
    </div>
  );
}