/**
 * CardPoolInspector.jsx
 *
 * Lists all global cards grouped by rarity.
 * Click a row to toggle that card into/out of the character's card pool.
 *
 * @param {object} character - The active character object
 * @param {object} state     - Full editor state (for global asset lists)
 * @param {object} actions   - Editor actions
 */

import InspectorSection from "@/components/editor/inspector/shared/InspectorSection";
import PoolRow from "@/components/editor/inspector/project/PoolRow";
import { COLOR_TEXT_SECONDARY } from "@/components/editor/shared/sidebarStyles";

// Canonical display order for card rarities
const RARITIES = ["Common", "Uncommon", "Rare", "Curse"];

export default function CardPoolInspector({ character, state, actions }) {
  // Starter cards are for starting decks only — excluded from reward pools
  const allCards = state.assets.cards.allIds
    .map((id) => state.assets.cards.byId[id])
    .filter((c) => c && c.rarity !== "Starter");

  if (allCards.length === 0) {
    return (
      <div style={{ padding: 12, fontSize: 13, color: COLOR_TEXT_SECONDARY }}>
        No cards created yet. Create cards in Assets mode first.
      </div>
    );
  }

  const poolIds = new Set(character.cardPool ?? []);

  // Group cards into rarity buckets; unknown rarities collected at the end
  const knownGroups = RARITIES.map((rarity) => ({
    rarity,
    items: allCards.filter((c) => (c.rarity ?? "Common") === rarity),
  })).filter((g) => g.items.length > 0);

  const knownRaritySet = new Set(RARITIES);
  const otherItems = allCards.filter((c) => !knownRaritySet.has(c.rarity ?? "Common"));
  const groups = otherItems.length > 0
    ? [...knownGroups, { rarity: "Other", items: otherItems }]
    : knownGroups;

  return (
    <div>
      {groups.map(({ rarity, items }) => (
        <InspectorSection key={rarity} title={rarity}>
          {items.map((card) => (
            <PoolRow
              key={card.id}
              label={card.name ?? "Unnamed Card"}
              inPool={poolIds.has(card.id)}
              onToggle={() => actions.toggleCharacterPoolAsset(character.id, "cards", card.id)}
            />
          ))}
        </InspectorSection>
      ))}
    </div>
  );
}
