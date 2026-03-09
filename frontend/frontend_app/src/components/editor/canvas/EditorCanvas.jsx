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

import { useEffect } from "react";
import { useEditor } from "@/state/editor/useEditor";

import CardPreview from "@/components/editor/canvas/assets/CardPreview";
import RelicPreview from "@/components/editor/canvas/assets/RelicPreview";
import PotionPreview from "@/components/editor/canvas/assets/PotionPreview";
import EnemyPreview from "@/components/editor/canvas/assets/EnemyPreview";

import ProjectCanvas from "@/components/editor/canvas/ProjectCanvas";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

function usePreloadAssetImages(assets) {
  useEffect(() => {
    const urls = [
      ...Object.values(assets.cards.byId).map(c => c.imageUrl ? `${API_BASE}/api/assets/file/?path=cards/${c.imageUrl}` : null),
      ...Object.values(assets.relics.byId).map(r => r.imageUrl ? `${API_BASE}/api/assets/file/?path=relics/${r.imageUrl}` : null),
      ...Object.values(assets.potions.byId).map(p => p.imageUrl ? `${API_BASE}/api/assets/file/?path=potions/${p.imageUrl}` : null),
      ...Object.values(assets.enemies.byId).map(e => e.imageUrl ? `${API_BASE}/api/assets/file/?path=monsters/${e.identity?.type ?? "basic"}/${e.imageUrl}` : null),
    ].filter(Boolean);
    urls.forEach(url => { const img = new Image(); img.src = url; });
  }, [assets]); // re-run after backend state loads
}

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
  usePreloadAssetImages(state.assets);

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
      <div key={selectedId} style={{ flex: 1, minHeight: 0, animation: "fadeIn 0.15s ease" }}>
        <Preview selected={selected} />
      </div>
    </div>
  );
}
