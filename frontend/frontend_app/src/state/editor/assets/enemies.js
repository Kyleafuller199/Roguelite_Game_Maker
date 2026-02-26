import { makeId } from "@/utils/makeId";

export function createEnemy(setState, name) {
  setState((prev) => {
    const id = makeId("enemy");

    const newEnemy = {
      id,
      imageUrl: "", // V1 (same idea as card/relic/potion)
      identity: {
        name: name || "New Enemy",
        type: "basic", // basic | elite | boss — matches EnemyIdentity inspector
        startingHealth: 40,
        startingBlock: 0,
      },
      moves: [],
      behavior: {
        behaviorType: "cycle", // cycle | custom (for now)
        cycleOrder: [],        // array of move ids
      },
    };

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

export function deleteSelectedEnemy(setState) {
  setState((prev) => {
    if (prev.mode !== "assets" || prev.entityType !== "enemy" || !prev.selectedId) return prev;

    const id = prev.selectedId;
    const { [id]: _removed, ...newById } = prev.assets.enemies.byId;

    return {
      ...prev,
      selectedId: null,
      assets: {
        ...prev.assets,
        enemies: {
          ...prev.assets.enemies,
          byId: newById,
          allIds: prev.assets.enemies.allIds.filter((enemyId) => enemyId !== id),
        },
      },
    };
  });
}