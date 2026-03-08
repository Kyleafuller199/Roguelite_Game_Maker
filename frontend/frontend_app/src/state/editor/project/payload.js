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
 * Pool ownership:
 * - cardPool / relicPool come directly from the character (class-specific)
 * - potionPool comes from the project (shared across all characters)
 */

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

  // ── Pools (ID arrays, filtered to existing assets) ───────────────────────
  const cardPoolIds   = (character.cardPool  ?? []).filter((id) => cards.byId[id]);
  const relicPoolIds  = (character.relicPool ?? []).filter((id) => relics.byId[id]);
  const potionPoolIds = (project.pools.potions ?? []).filter((id) => potions.byId[id]);

  // ── Asset maps (each asset defined once) ────────────────────────────────
  // Cards: pool + any starting deck cards not already in the pool
  const deckCardIds = (character.startingDeck ?? []).map((e) => e.cardId);
  const allCardIds  = [...new Set([...cardPoolIds, ...deckCardIds])];
  const cardMap = Object.fromEntries(
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
