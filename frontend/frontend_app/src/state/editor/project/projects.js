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
          [`project:${id}:pools`]: true,
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
      pools: { cards: [], relics: [], potions: [] },
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

/**
 * deleteProject
 * Removes a project and all its characters from state.
 * Resets selectedNode to null if the deleted project was selected.
 */
export function deleteProject(setState, projectId) {
  setState((prev) => {
    const project = prev.project.projects.byId[projectId];
    if (!project) return prev;

    // Remove all characters belonging to this project
    const charIdsToRemove = new Set(project.characterIds ?? []);
    const newCharById = Object.fromEntries(
      Object.entries(prev.project.characters.byId).filter(([id]) => !charIdsToRemove.has(id))
    );
    const newCharAllIds = prev.project.characters.allIds.filter((id) => !charIdsToRemove.has(id));

    // Remove project from normalized map
    const { [projectId]: _removed, ...newProjectsById } = prev.project.projects.byId;
    const newProjectAllIds = prev.project.projects.allIds.filter((id) => id !== projectId);

    // Reset selection if the deleted project was selected
    const wasSelected = prev.project.selectedNode?.projectId === projectId;
    const nextSelectedNode = wasSelected ? null : prev.project.selectedNode;

    return {
      ...prev,
      project: {
        ...prev.project,
        projects: {
          byId: newProjectsById,
          allIds: newProjectAllIds,
        },
        characters: {
          byId: newCharById,
          allIds: newCharAllIds,
        },
        selectedNode: nextSelectedNode,
      },
    };
  });
}

/**
 * updateProject
 * Applies a shallow patch to a project's top-level fields (e.g. name).
 */
export function updateProject(setState, projectId, patch) {
  setState((prev) => {
    const project = prev.project.projects.byId[projectId];
    if (!project) return prev;

    return {
      ...prev,
      project: {
        ...prev.project,
        projects: {
          ...prev.project.projects,
          byId: {
            ...prev.project.projects.byId,
            [projectId]: { ...project, ...patch },
          },
        },
      },
    };
  });
}

/**
 * deleteCharacter
 * Removes a character from both the characters map and the project's characterIds list.
 * Resets selectedNode to the parent project node after deletion.
 */
export function deleteCharacter(setState, projectId, characterId) {
  setState((prev) => {
    const project = prev.project.projects.byId[projectId];
    if (!project) return prev;

    const { [characterId]: _removed, ...newById } = prev.project.characters.byId;

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
              characterIds: (project.characterIds ?? []).filter((id) => id !== characterId),
            },
          },
        },
        characters: {
          byId: newById,
          allIds: prev.project.characters.allIds.filter((id) => id !== characterId),
        },
        selectedNode: { kind: "project", projectId },
      },
    };
  });
}

/**
 * updateCharacter
 * Applies a shallow patch to a character's top-level fields.
 * Used for name edits and any other direct field changes.
 */
export function updateCharacter(setState, characterId, patch) {
  setState((prev) => {
    const character = prev.project.characters.byId[characterId];
    if (!character) return prev;

    return {
      ...prev,
      project: {
        ...prev.project,
        characters: {
          ...prev.project.characters,
          byId: {
            ...prev.project.characters.byId,
            [characterId]: { ...character, ...patch },
          },
        },
      },
    };
  });
}

/**
 * setCharacterStartingRelic
 * Assigns (or clears) the starting relic for a character.
 * Pass null to unset.
 */
export function setCharacterStartingRelic(setState, characterId, relicId) {
  setState((prev) => {
    const character = prev.project.characters.byId[characterId];
    if (!character) return prev;

    return {
      ...prev,
      project: {
        ...prev.project,
        characters: {
          ...prev.project.characters,
          byId: {
            ...prev.project.characters.byId,
            [characterId]: { ...character, startingRelicId: relicId ?? null },
          },
        },
      },
    };
  });
}

/**
 * toggleCharacterDeckCard
 * Adds a card to the starting deck (with count 1), or removes it if already present.
 */
export function toggleCharacterDeckCard(setState, characterId, cardId) {
  setState((prev) => {
    const character = prev.project.characters.byId[characterId];
    if (!character) return prev;

    const deck = character.startingDeck ?? [];
    const exists = deck.some((e) => e.cardId === cardId);
    const newDeck = exists
      ? deck.filter((e) => e.cardId !== cardId)
      : [...deck, { cardId, count: 1 }];

    return {
      ...prev,
      project: {
        ...prev.project,
        characters: {
          ...prev.project.characters,
          byId: {
            ...prev.project.characters.byId,
            [characterId]: { ...character, startingDeck: newDeck },
          },
        },
      },
    };
  });
}

/**
 * setCharacterDeckCardCount
 * Updates the count for a card already in the starting deck.
 * Count is clamped to a minimum of 1.
 */
export function setCharacterDeckCardCount(setState, characterId, cardId, count) {
  setState((prev) => {
    const character = prev.project.characters.byId[characterId];
    if (!character) return prev;

    const deck = character.startingDeck ?? [];
    const newDeck = deck.map((e) =>
      e.cardId === cardId ? { ...e, count: Math.max(1, count) } : e
    );

    return {
      ...prev,
      project: {
        ...prev.project,
        characters: {
          ...prev.project.characters,
          byId: {
            ...prev.project.characters.byId,
            [characterId]: { ...character, startingDeck: newDeck },
          },
        },
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
