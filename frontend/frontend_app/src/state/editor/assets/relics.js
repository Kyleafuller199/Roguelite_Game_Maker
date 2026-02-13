export function createRelic(setState) {
  setState((prev) => {
    const id = `relic_${Date.now()}`;

    const newRelic = {
      id,
      imageId: "",
      identity: {
        name: "New Relic",
        rarity: "Common",
      },
      effects: [],
      triggers: [],
    };

    return {
      ...prev,
      mode: "assets",
      entityType: "relic",
      selectedId: id,
      assets: {
        ...prev.assets,
        relics: {
          ...prev.assets.relics,
          byId: { ...prev.assets.relics.byId, [id]: newRelic },
          allIds: [id, ...prev.assets.relics.allIds],
        },
      },
    };
  });
}

export function updateSelectedRelic(setState, patch) {
  setState((prev) => {
    if (prev.mode !== "assets" || prev.entityType !== "relic" || !prev.selectedId) return prev;

    const id = prev.selectedId;
    const current = prev.assets.relics.byId[id];
    if (!current) return prev;

    return {
      ...prev,
      assets: {
        ...prev.assets,
        relics: {
          ...prev.assets.relics,
          byId: { ...prev.assets.relics.byId, [id]: { ...current, ...patch } },
        },
      },
    };
  });
}

export function deleteSelectedRelic(setState) {
  setState((prev) => {
    if (prev.mode !== "assets" || prev.entityType !== "relic" || !prev.selectedId) return prev;

    const id = prev.selectedId;
    const { [id]: _removed, ...newById } = prev.assets.relics.byId;

    return {
      ...prev,
      selectedId: null,
      assets: {
        ...prev.assets,
        relics: {
          ...prev.assets.relics,
          byId: newById,
          allIds: prev.assets.relics.allIds.filter((relicId) => relicId !== id),
        },
      },
    };
  });
}