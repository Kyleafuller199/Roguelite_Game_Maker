import { makeId } from "@/utils/makeId";

export function createPotion(setState, name) {
  setState((prev) => {
    const id = makeId("potion");

    const newPotion = {
      id,
      imageId: "",
      imageUrl: "",
      identity: {
        name: name || "New Potion",
        rarity: "Common",
        useContext: "anyTime",
      },
      effects: [],
    };

    return {
      ...prev,
      mode: "assets",
      entityType: "potion",
      selectedId: id,
      assets: {
        ...prev.assets,
        potions: {
          ...prev.assets.potions,
          byId: { ...prev.assets.potions.byId, [id]: newPotion },
          allIds: [id, ...prev.assets.potions.allIds],
        },
      },
    };
  });
}

export function updateSelectedPotion(setState, patch) {
  setState((prev) => {
    if (prev.mode !== "assets" || prev.entityType !== "potion" || !prev.selectedId) return prev;
    const id = prev.selectedId;
    const current = prev.assets.potions.byId[id];
    if (!current) return prev;

    return {
      ...prev,
      assets: {
        ...prev.assets,
        potions: {
          ...prev.assets.potions,
          byId: { ...prev.assets.potions.byId, [id]: { ...current, ...patch } },
        },
      },
    };
  });
}

export function deleteSelectedPotion(setState) {
  setState((prev) => {
    if (prev.mode !== "assets" || prev.entityType !== "potion" || !prev.selectedId) return prev;

    const id = prev.selectedId;
    const { [id]: _removed, ...newById } = prev.assets.potions.byId;

    return {
      ...prev,
      selectedId: null,
      assets: {
        ...prev.assets,
        potions: {
          ...prev.assets.potions,
          byId: newById,
          allIds: prev.assets.potions.allIds.filter((potionId) => potionId !== id),
        },
      },
    };
  });
}