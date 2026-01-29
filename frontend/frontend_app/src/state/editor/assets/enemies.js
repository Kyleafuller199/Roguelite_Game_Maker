export function createEnemy(setState) {
    setState((prev) => {
      const id = `enemy_${Date.now()}`;
      const newEnemy = { id, name: "New Enemy", hp: 30 };
  
      return {
        ...prev,
        mode: "assets",
        entityType: "enemy",
        selectedId: id,
        assets: {
          ...prev.assets,
          enemies: {
            ...prev.assets.enemies,
            byId: { ...prev.assets.enemies.byId, [id]: newEnemy },
            allIds: [id, ...prev.assets.enemies.allIds],
          },
        },
      };
    });
  }
  
  export function updateSelectedEnemy(setState, patch) {
    setState((prev) => {
      if (prev.mode !== "assets" || prev.entityType !== "enemy" || !prev.selectedId) return prev;
      const id = prev.selectedId;
      const current = prev.assets.enemies.byId[id];
      if (!current) return prev;
  
      return {
        ...prev,
        assets: {
          ...prev.assets,
          enemies: {
            ...prev.assets.enemies,
            byId: { ...prev.assets.enemies.byId, [id]: { ...current, ...patch } },
          },
        },
      };
    });
  }
  