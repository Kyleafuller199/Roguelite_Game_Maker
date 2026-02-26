/**
 * PotionPoolInspector.jsx
 *
 * Lists all global potions grouped by rarity.
 * Click a row to toggle that potion into/out of the project's potion pool.
 *
 * @param {object} project - The active project object
 * @param {object} state   - Full editor state (for global asset lists)
 * @param {object} actions - Editor actions
 */

import InspectorSection from "@/components/editor/inspector/shared/InspectorSection";
import PoolRow from "@/components/editor/inspector/project/PoolRow";
import { COLOR_TEXT_SECONDARY } from "@/components/editor/shared/sidebarStyles";

// Canonical display order for potion rarities
const RARITIES = ["Common", "Uncommon", "Rare", "Shop"];

export default function PotionPoolInspector({ project, state, actions }) {
  const allPotions = state.assets.potions.allIds
    .map((id) => state.assets.potions.byId[id])
    .filter(Boolean);

  if (allPotions.length === 0) {
    return (
      <div style={{ padding: 12, fontSize: 13, color: COLOR_TEXT_SECONDARY }}>
        No potions created yet. Create potions in Assets mode first.
      </div>
    );
  }

  const poolIds = new Set(project.pools.potions ?? []);

  const knownGroups = RARITIES.map((rarity) => ({
    rarity,
    items: allPotions.filter((p) => (p.identity?.rarity ?? "Common") === rarity),
  })).filter((g) => g.items.length > 0);

  const knownRaritySet = new Set(RARITIES);
  const otherItems = allPotions.filter((p) => !knownRaritySet.has(p.identity?.rarity ?? "Common"));
  const groups = otherItems.length > 0
    ? [...knownGroups, { rarity: "Other", items: otherItems }]
    : knownGroups;

  return (
    <div>
      {groups.map(({ rarity, items }) => (
        <InspectorSection key={rarity} title={rarity}>
          {items.map((potion) => (
            <PoolRow
              key={potion.id}
              label={potion.identity?.name ?? potion.name ?? "Unnamed Potion"}
              inPool={poolIds.has(potion.id)}
              onToggle={() => actions.togglePoolAsset(project.id, "potions", potion.id)}
            />
          ))}
        </InspectorSection>
      ))}
    </div>
  );
}
