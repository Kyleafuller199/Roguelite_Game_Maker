/**
 * payload.js
 *
 * Builds the "start run" payload from editor state.
 *
 * The payload is a fully resolved object tree — ID references are expanded
 * into full asset objects. This is what the game state manager consumes to
 * initialise a run.
 *
 * buildRunPayload(state, projectId, characterId?)
 * - characterId defaults to the project's first character if omitted.
 * - Returns null if the project is invalid or has no usable character.
 *
 * Pool merge semantics:
 * - Character pools EXTEND the project pool (additive, de-duped by asset ID).
 * - An empty character pool means "use the project pool as-is".
 */

/**
 * Resolves an array of asset IDs into full asset objects.
 * Silently skips IDs that don't resolve in byId.
 */
function resolveIds(ids, byId) {
  return (ids ?? []).map((id) => byId[id]).filter(Boolean);
}

/**
 * Merges projectIds + characterIds into a de-duped list of full asset objects.
 * Project order is preserved; character-only additions are appended after.
 */
function mergePool(projectIds, characterIds, byId) {
  const seen = new Set();
  const result = [];
  for (const id of [...(projectIds ?? []), ...(characterIds ?? [])]) {
    if (!seen.has(id) && byId[id]) {
      seen.add(id);
      result.push(byId[id]);
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
 * @returns {object|null}         - Resolved run payload, or null on failure
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

  // Resolve starting relic (null if none assigned)
  const startingRelic = character.startingRelicId
    ? (relics.byId[character.startingRelicId] ?? null)
    : null;

  // Resolve starting deck — expand each { cardId, count } into { card, count }
  const startingDeck = (character.startingDeck ?? [])
    .map(({ cardId, count }) => {
      const card = cards.byId[cardId];
      return card ? { card, count } : null;
    })
    .filter(Boolean);

  // Merged pools: project pool extended by any character-specific additions
  const cardPool   = mergePool(project.pools.cards,   character.pools?.cards,   cards.byId);
  const relicPool  = mergePool(project.pools.relics,  character.pools?.relics,  relics.byId);
  const potionPool = mergePool(project.pools.potions, character.pools?.potions, potions.byId);

  // Acts: resolve enemy IDs → full enemy objects per encounter role
  const acts = {};
  for (const [actNum, actData] of Object.entries(project.acts ?? {})) {
    acts[actNum] = {
      basics: resolveIds(actData.basics, enemies.byId),
      elites: resolveIds(actData.elites, enemies.byId),
      bosses: resolveIds(actData.bosses, enemies.byId),
      events: actData.events ?? [],
    };
  }

  return {
    projectId:   project.id,
    projectName: project.name,
    character: {
      id:           character.id,
      name:         character.name,
      startingRelic,
      startingDeck,
    },
    cardPool,
    relicPool,
    potionPool,
    acts,
  };
}
