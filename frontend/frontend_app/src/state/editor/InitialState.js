/**
 * initialState.js
 * Defines the default shape and starting values for the editor state.
 * Used on first load and as a fallback when persisted state fails.
 */
export const initialState = {
  // Current editor mode and selection
  mode: "assets",
  entityType: "card",
  selectedId: "card_basic_strike",

  // Asset data stored in normalized form (byId + allIds)
  assets: {
    cards: {
      byId: {
        card_basic_strike: {
          id: "card_basic_strike",
          name: "Basic Strike",
          type: "Attack",
          rarity: "Common",
          cost: 1,
        },
        card_2: {
          id: "card_2",
          name: "Card 2",
          type: "Skill",
          rarity: "Common",
          cost: 1,
        },
      },
      allIds: ["card_basic_strike", "card_2"],
    },

    relics: {
      byId: {
        relic_ancient_coin: {
          id: "relic_ancient_coin",
          imageId: "",
          identity: { name: "Ancient Coin", rarity: "Rare" },
          effects: [],
          triggers: [],
        },
        relic_burning_blood: {
          id: "relic_burning_blood",
          imageId: "",
          identity: { name: "Burning Blood", rarity: "Starter" },
          effects: [],
          triggers: [],
        },
      },
      allIds: ["relic_ancient_coin", "relic_burning_blood"],
    },

    potions: {
      byId: {
        potion_fire: {
          id: "potion_fire",
          imageId: "",
          imageUrl: "",
          identity: { name: "Fire Potion", rarity: "Common", useContext: "anyTime" },
          effects: [],
        },
        potion_strength: {
          id: "potion_strength",
          imageId: "",
          imageUrl: "",
          identity: { name: "Strength Potion", rarity: "Uncommon", useContext: "anyTime" },
          effects: [],
        },
      },
      allIds: ["potion_fire", "potion_strength"],
    },

    enemies: {
      byId: {
        enemy_slime: { id: "enemy_slime", name: "Green Slime", hp: 28 },
        enemy_cultist: { id: "enemy_cultist", name: "Cultist", hp: 50 },
      },
      allIds: ["enemy_slime", "enemy_cultist"],
    },
  },

  // Project-scoped data (expanded later)
  projects: {
    globalPools: { byId: {}, allIds: [] },
    characters: { byId: {}, allIds: [] },
  },
};