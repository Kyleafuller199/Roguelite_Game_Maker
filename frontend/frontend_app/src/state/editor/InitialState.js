// src/state/editor/InitialState.js
export const initialState = {
    mode: "assets",
    entityType: "card",
    selectedId: "card_basic_strike",
  
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
          relic_ancient_coin: { id: "relic_ancient_coin", name: "Ancient Coin", tier: "Rare" },
          relic_burning_blood: { id: "relic_burning_blood", name: "Burning Blood", tier: "Starter" },
        },
        allIds: ["relic_ancient_coin", "relic_burning_blood"],
      },
  
      potions: {
        byId: {
          potion_fire: { id: "potion_fire", name: "Fire Potion", rarity: "Common", uses: 1 },
          potion_strength: { id: "potion_strength", name: "Strength Potion", rarity: "Uncommon", uses: 1 },
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
  
    projects: {
      globalPools: { byId: {}, allIds: [] },
      characters: { byId: {}, allIds: [] },
    },
  };  