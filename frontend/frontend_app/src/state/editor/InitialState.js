
export const initialState = {
    mode: "assets",
    entityType: "card",
    selectedId: "card_basic_strike",
    assets: {
      cards: {
        byId: {
          card_basic_strike: { id: "card_basic_strike", name: "Basic Strike", type: "Attack", rarity: "Common", cost: 1 },
          card_2: { id: "card_2", name: "Card 2", type: "Skill", rarity: "Common", cost: 1 },
        },
        allIds: ["card_basic_strike", "card_2"],
      },
      relics: { byId: {}, allIds: [] },
      potions: { byId: {}, allIds: [] },
      enemies: { byId: {}, allIds: [] },
    },
    projects: {
      globalPools: { byId: {}, allIds: [] },
      characters: { byId: {}, allIds: [] },
    },
  };
  