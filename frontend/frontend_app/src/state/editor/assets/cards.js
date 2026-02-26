import { makeId } from "@/utils/makeId";

export function createCard(setState, name) {
  setState((prev) => {
    const id = makeId("card");
    const newCard = { id, name: name || "New Card", type: "Attack", rarity: "Common", cost: 1 };

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

export function deleteSelectedCard(setState) {
  setState((prev) => {
    if (prev.mode !== "assets" || prev.entityType !== "card" || !prev.selectedId) return prev;

    const id = prev.selectedId;
    const { [id]: _removed, ...newById } = prev.assets.cards.byId;

    return {
      ...prev,
      selectedId: null,
      assets: {
        ...prev.assets,
        cards: {
          ...prev.assets.cards,
          byId: newById,
          allIds: prev.assets.cards.allIds.filter((cardId) => cardId !== id),
        },
      },
    };
  });
}
  