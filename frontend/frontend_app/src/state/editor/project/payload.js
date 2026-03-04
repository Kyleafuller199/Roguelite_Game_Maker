/**
 * payload.js
 *
 * Builds the "start run" payload from editor state.
 *
 * Shape: fully normalized — each asset defined once in its map,
 * everything else (pools, acts, deck, relic) uses ID references only.
 *
 * buildRunPayload(state, projectId, characterId?)
 * - characterId defaults to the project's first character if omitted.
 * - Returns null if the project is invalid or has no usable character.
 *
 * Pool merge semantics:
 * - Character pools EXTEND the project pool (additive, de-duped by asset ID).
 * - An empty character pool means "use the project pool as-is".
 */

/** Returns a de-duped array of IDs that exist in byId. */
function mergePoolIds(projectIds, characterIds, byId) {
  const seen = new Set();
  const result = [];
  for (const id of [...(projectIds ?? []), ...(characterIds ?? [])]) {
    if (!seen.has(id) && byId[id]) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

/**
 * buildRunPayload
 *
 * @param {object}  state         - Full editor state
 * @param {string}  projectId     - ID of the project to start
 * @param {string}  [characterId] - Character to play; defaults to first in project
 * @returns {object|null}         - Normalized run payload, or null on failure
 */
export function buildRunPayload(state, projectId, characterId = null) {
  const project = state.project.projects.byId[projectId];
  if (!project) return null;

  const { cards, relics, potions, enemies } = state.assets;

  // Resolve character — default to first if none specified
  const charId = characterId ?? project.characterIds?.[0] ?? null;
  if (!charId) return null;
  const character = state.project.characters.byId[charId];
  if (!character) return null;

  // ── Pools (ID arrays, de-duped) ─────────────────────────────────────────
  const cardPoolIds   = mergePoolIds(project.pools.cards,   character.pools?.cards,   cards.byId);
  const relicPoolIds  = mergePoolIds(project.pools.relics,  character.pools?.relics,  relics.byId);
  const potionPoolIds = mergePoolIds(project.pools.potions, character.pools?.potions, potions.byId);

  // ── Asset maps (each asset defined once) ────────────────────────────────
  // Cards: pool + any starting deck cards not already in the pool
  const deckCardIds = (character.startingDeck ?? []).map((e) => e.cardId);
  const allCardIds  = [...new Set([...cardPoolIds, ...deckCardIds])];
  const cardMap     = Object.fromEntries(
    allCardIds.filter((id) => cards.byId[id]).map((id) => [id, cards.byId[id]])
  );

  // Relics: pool + starting relic if set
  const allRelicIds = [...new Set([
    ...relicPoolIds,
    ...(character.startingRelicId ? [character.startingRelicId] : []),
  ])];
  const relicMap = Object.fromEntries(
    allRelicIds.filter((id) => relics.byId[id]).map((id) => [id, relics.byId[id]])
  );

  const potionMap = Object.fromEntries(
    potionPoolIds.filter((id) => potions.byId[id]).map((id) => [id, potions.byId[id]])
  );

  // ── Acts + enemy map ─────────────────────────────────────────────────────
  const acts = {};
  const enemyMap = {};
  for (const [actNum, actData] of Object.entries(project.acts ?? {})) {
    const allIds = [
      ...(actData.basics ?? []),
      ...(actData.elites ?? []),
      ...(actData.bosses ?? []),
    ];
    for (const id of allIds) {
      if (enemies.byId[id]) enemyMap[id] = enemies.byId[id];
    }
    acts[actNum] = {
      basics: (actData.basics ?? []).filter((id) => enemies.byId[id]),
      elites: (actData.elites ?? []).filter((id) => enemies.byId[id]),
      bosses: (actData.bosses ?? []).filter((id) => enemies.byId[id]),
      events: actData.events ?? [],
    };
  }

  return {
    projectId:   project.id,
    projectName: project.name,
    character: {
      id:               character.id,
      name:             character.name,
      imageUrl:         character.imageUrl ?? "",
      startingRelicId:  character.startingRelicId ?? null,
      startingDeck:     (character.startingDeck ?? []).filter((e) => cards.byId[e.cardId]),
    },
    cardMap,
    relicMap,
    potionMap,
    enemyMap,
    cardPool:   cardPoolIds,
    relicPool:  relicPoolIds,
    potionPool: potionPoolIds,
    acts,
  };
}
