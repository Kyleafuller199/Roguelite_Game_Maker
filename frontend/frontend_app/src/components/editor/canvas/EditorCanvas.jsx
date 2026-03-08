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
 * - Project mode: delegates to ProjectCanvas
 */

import { useEditor } from "@/state/editor/useEditor";

import CardPreview from "@/components/editor/canvas/assets/CardPreview";
import RelicPreview from "@/components/editor/canvas/assets/RelicPreview";
import PotionPreview from "@/components/editor/canvas/assets/PotionPreview";
import EnemyPreview from "@/components/editor/canvas/assets/EnemyPreview";

import ProjectCanvas from "@/components/editor/canvas/ProjectCanvas";

import {
  canvasContainer,
  canvasSectionTitle,
  COLOR_TEXT_SECONDARY,
} from "./canvasStyles";

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

  if (mode === "project") {
    return <ProjectCanvas />;
  }

  // Asset mode requires a selection to preview.
  if (!selectedId || !entityType) {
    return (
      <div style={canvasContainer}>
        <div style={{ ...canvasSectionTitle, marginBottom: 0, fontSize: 20 }}>Live Preview</div>
        <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY, marginTop: 8 }}>
          Select an asset to preview it here.
        </div>
      </div>
    );
  }

  /**
   * Resolve the selected asset from normalized state by entity type.
   */
  let selected = null;

  if (entityType === "card") selected = state.assets.cards.byId[selectedId];
  else if (entityType === "relic") selected = state.assets.relics.byId[selectedId];
  else if (entityType === "potion") selected = state.assets.potions.byId[selectedId];
  else if (entityType === "enemy") selected = state.assets.enemies.byId[selectedId];

  const Preview = PREVIEWS[entityType];

  // Defensive rendering for stale selections or unsupported entity types.
  if (!selected || !Preview) {
    return (
      <div style={canvasContainer}>
        <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY }}>
          Selection not found.
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...canvasContainer, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ ...canvasSectionTitle, marginBottom: 12, fontSize: 20, flexShrink: 0 }}>Live Preview</div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Preview selected={selected} />
      </div>
    </div>
  );
}
