/**
 * EditorInspector.jsx
 * Renders the inspector panel for the currently selected entity.
 * (Currently: asset mode only; project mode comes later.)
 */
import { useEditor } from "@/state/editor/useEditor";
import Label from "@/components/editor/inspector/shared/Label";

import CardInspector from "@/components/editor/inspector/assets/cards/CardInspector";
import RelicInspector from "@/components/editor/inspector/assets/RelicInspector";
import PotionInspector from "@/components/editor/inspector/assets/PotionInspector";
import EnemyInspector from "@/components/editor/inspector/assets/EnemyInspector";

// Maps entity types to their inspector components
const INSPECTORS = {
  card: CardInspector,
  relic: RelicInspector,
  potion: PotionInspector,
  enemy: EnemyInspector,
};

export default function EditorInspector() {
  const { state, actions } = useEditor();

  const isAssetMode = state.mode === "assets";
  const hasSelection = Boolean(state.selectedId);

  if (!isAssetMode || !hasSelection) {
    return <div style={{ padding: 12 }}>Select something to edit</div>;
  }

  const { entityType, selectedId } = state;

  // Resolve selected entity + update handler based on entity type
  let selected = null;
  let update = null;

  if (entityType === "card") {
    selected = state.assets.cards.byId[selectedId];
    update = actions.updateSelectedCard;
  } else if (entityType === "relic") {
    selected = state.assets.relics.byId[selectedId];
    update = actions.updateSelectedRelic;
  } else if (entityType === "potion") {
    selected = state.assets.potions.byId[selectedId];
    update = actions.updateSelectedPotion;
  } else if (entityType === "enemy") {
    selected = state.assets.enemies.byId[selectedId];
    update = actions.updateSelectedEnemy;
  }

  const Inspector = INSPECTORS[entityType];

  if (!selected || !update || !Inspector) {
    return <div style={{ padding: 12 }}>Selection not found</div>;
  }

  return (
    <div style={{ padding: 12 }}>
      {/* Asset-specific fields */}
      <Inspector selected={selected} update={update} />
    </div>
  );
}