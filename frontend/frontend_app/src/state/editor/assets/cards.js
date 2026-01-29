export function createCard(setState) {
    setState((prev) => {
      const id = `card_${Date.now()}`;
      const newCard = { id, name: "New Card", type: "Attack", rarity: "Common", cost: 1 };
  
      return {
        ...prev,
        mode: "assets",
        entityType: "card",
        selectedId: id,
        assets: {
          ...prev.assets,
          cards: {
            ...prev.assets.cards,
            byId: { ...prev.assets.cards.byId, [id]: newCard },
            allIds: [id, ...prev.assets.cards.allIds],
          },
        },
      };
    });
  }
  
  export function updateSelectedCard(setState, patch) {
    setState((prev) => {
      if (prev.mode !== "assets" || prev.entityType !== "card" || !prev.selectedId) return prev;
      const id = prev.selectedId;
      const current = prev.assets.cards.byId[id];
      if (!current) return prev;
  
      return {
        ...prev,
        assets: {
          ...prev.assets,
          cards: {
            ...prev.assets.cards,
            byId: { ...prev.assets.cards.byId, [id]: { ...current, ...patch } },
          },
        },
      };
    });
  }
  