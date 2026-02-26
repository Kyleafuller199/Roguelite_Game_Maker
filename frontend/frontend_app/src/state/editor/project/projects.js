/**
 * projects.js
 *
 * Project-level state actions for the editor.
 *
 * Mirrors the pattern used by /assets modules:
 * - Each function receives setState and operates via setState(prev => next)
 * - No direct state reads; always derive from prev inside setState
 */

import { makeId } from "@/utils/makeId";

export function createProject(setState, name) {
  setState((prev) => {
    const id = makeId("project");

    const newProject = {
      id,
      name: name || "New Project",
      pools: { cards: [], relics: [], potions: [], enemies: [] },
      acts: {
        1: { basics: [], elites: [], bosses: [], events: [] },
        2: { basics: [], elites: [], bosses: [], events: [] },
        3: { basics: [], elites: [], bosses: [], events: [] },
      },
      characterIds: [],
    };

    return {
      ...prev,
      mode: "project",
      project: {
        ...prev.project,
        projects: {
          byId: { ...prev.project.projects.byId, [id]: newProject },
          allIds: [id, ...prev.project.projects.allIds],
        },
        selectedNode: { kind: "project", projectId: id },
        expanded: {
          ...prev.project.expanded,
          [`project:${id}`]: true,
          [`project:${id}:characters`]: true,
        },
      },
    };
  });
}

export function createCharacter(setState, projectId, name) {
  setState((prev) => {
    const id = makeId("char");
    const project = prev.project.projects.byId[projectId];
    if (!project) return prev;

    const newCharacter = {
      id,
      projectId,
      name: name || "New Character",
      startingRelicId: null,
      startingDeck: [],
      pools: { cards: [], relics: [] },
    };

    return {
      ...prev,
      project: {
        ...prev.project,
        projects: {
          ...prev.project.projects,
          byId: {
            ...prev.project.projects.byId,
            [projectId]: {
              ...project,
              characterIds: [...(project.characterIds ?? []), id],
            },
          },
        },
        characters: {
          byId: { ...prev.project.characters.byId, [id]: newCharacter },
          allIds: [...prev.project.characters.allIds, id],
        },
        selectedNode: { kind: "character", projectId, characterId: id },
      },
    };
  });
}

export function togglePoolAsset(setState, projectId, poolType, assetId) {
  setState((prev) => {
    const project = prev.project.projects.byId[projectId];
    if (!project) return prev;

    const pool = project.pools[poolType] ?? [];
    const newPool = pool.includes(assetId)
      ? pool.filter((id) => id !== assetId)
      : [...pool, assetId];

    return {
      ...prev,
      project: {
        ...prev.project,
        projects: {
          ...prev.project.projects,
          byId: {
            ...prev.project.projects.byId,
            [projectId]: {
              ...project,
              pools: { ...project.pools, [poolType]: newPool },
            },
          },
        },
      },
    };
  });
}

export function toggleActEnemy(setState, projectId, act, role, enemyId) {
  setState((prev) => {
    const project = prev.project.projects.byId[projectId];
    if (!project) return prev;

    const actData = project.acts[act] ?? { basics: [], elites: [], bosses: [], events: [] };
    const list = actData[role] ?? [];
    const newList = list.includes(enemyId)
      ? list.filter((id) => id !== enemyId)
      : [...list, enemyId];

    return {
      ...prev,
      project: {
        ...prev.project,
        projects: {
          ...prev.project.projects,
          byId: {
            ...prev.project.projects.byId,
            [projectId]: {
              ...project,
              acts: {
                ...project.acts,
                [act]: { ...actData, [role]: newList },
              },
            },
          },
        },
      },
    };
  });
}
