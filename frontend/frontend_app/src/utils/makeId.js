/**
 * makeId.js
 *
 * Shared utility for generating unique, prefixed IDs throughout the editor.
 *
 * Uses crypto.randomUUID() for collision-free uniqueness.
 * The prefix makes IDs human-readable and easier to debug in state snapshots.
 *
 * @param {string} prefix - Short label for the entity type (e.g. "card", "eff")
 * @returns {string} A unique ID in the format "<prefix>_<uuid>"
 *
 * Usage:
 *   makeId("card")    → "card_550e8400-e29b-..."
 *   makeId("eff")     → "eff_550e8400-e29b-..."
 *   makeId("project") → "project_550e8400-e29b-..."
 */
export function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}
