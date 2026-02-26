/**
 * RelicPoolInspector.jsx
 *
 * Lists all global relics grouped by rarity.
 * Click a row to toggle that relic into/out of the project's relic pool.
 *
 * @param {object} project - The active project object
 * @param {object} state   - Full editor state (for global asset lists)
 * @param {object} actions - Editor actions
 */

import InspectorSection from "@/components/editor/inspector/shared/InspectorSection";
import PoolRow from "@/components/editor/inspector/project/PoolRow";
import { COLOR_TEXT_SECONDARY } from "@/components/editor/shared/sidebarStyles";

// Canonical display order for relic rarities
const RARITIES = ["Common", "Uncommon", "Rare", "Boss", "Shop"];

export default function RelicPoolInspector({ project, state, actions }) {
  const allRelics = state.assets.relics.allIds
    .map((id) => state.assets.relics.byId[id])
    .filter(Boolean);

  if (allRelics.length === 0) {
    return (
      <div style={{ padding: 12, fontSize: 13, color: COLOR_TEXT_SECONDARY }}>
        No relics created yet. Create relics in Assets mode first.
      </div>
    );
  }

  const poolIds = new Set(project.pools.relics ?? []);

  const knownGroups = RARITIES.map((rarity) => ({
    rarity,
    items: allRelics.filter((r) => (r.identity?.rarity ?? "Common") === rarity),
  })).filter((g) => g.items.length > 0);

  const knownRaritySet = new Set(RARITIES);
  const otherItems = allRelics.filter((r) => !knownRaritySet.has(r.identity?.rarity ?? "Common"));
  const groups = otherItems.length > 0
    ? [...knownGroups, { rarity: "Other", items: otherItems }]
    : knownGroups;

  return (
    <div>
      {groups.map(({ rarity, items }) => (
        <InspectorSection key={rarity} title={rarity}>
          {items.map((relic) => (
            <PoolRow
              key={relic.id}
              label={relic.identity?.name ?? relic.name ?? "Unnamed Relic"}
              inPool={poolIds.has(relic.id)}
              onToggle={() => actions.togglePoolAsset(project.id, "relics", relic.id)}
            />
          ))}
        </InspectorSection>
      ))}
    </div>
  );
}
