/**
 * EditorCanvas.jsx
 * Renders the live preview panel for the currently selected entity.
 * (Currently: asset mode only; project mode comes later.)
 */
import { useEditor } from "@/state/editor/useEditor";

import CardPreview from "@/components/editor/canvas/assets/CardPreview";
import RelicPreview from "@/components/editor/canvas/assets/RelicPreview";
import PotionPreview from "@/components/editor/canvas/assets/PotionPreview";
import EnemyPreview from "@/components/editor/canvas/assets/EnemyPreview";

const PREVIEWS = {
  card: CardPreview,
  relic: RelicPreview,
  potion: PotionPreview,
  enemy: EnemyPreview,
};

export default function EditorCanvas() {
  const { state } = useEditor();

  if (state.mode !== "assets" || !state.selectedId) {
    return <div style={{ padding: 16 }}>Live Preview</div>;
  }

  const { entityType, selectedId } = state;

  let selected = null;

  if (entityType === "card") selected = state.assets.cards.byId[selectedId];
  else if (entityType === "relic") selected = state.assets.relics.byId[selectedId];
  else if (entityType === "potion") selected = state.assets.potions.byId[selectedId];
  else if (entityType === "enemy") selected = state.assets.enemies.byId[selectedId];

  const Preview = PREVIEWS[entityType];

  if (!selected || !Preview) return <div style={{ padding: 16 }}>Selection not found</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Live Preview</h2>
      <Preview selected={selected} />
    </div>
  );
}