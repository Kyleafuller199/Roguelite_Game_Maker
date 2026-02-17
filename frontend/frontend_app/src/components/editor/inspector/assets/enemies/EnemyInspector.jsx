/**
 * EnemyInspector.jsx
 *
 * High-level container for editing Enemy assets inside the editor.
 *
 * Responsibility:
 * - Composes all enemy-related inspector sections.
 * - Mirrors the top-level enemy JSON structure.
 * - Passes the selected enemy object and update handler
 *   down to each section.
 *
 * Data Flow:
 * - `selected` represents the currently selected enemy asset.
 * - `update` is a function used by child sections to mutate
 *   specific fields within the selected enemy.
 */

import EnemyIdentity from "./sections/EnemyIdentity";
import EnemyImage from "./sections/EnemyImage";
import EnemyMoves from "./sections/EnemyMoves";
import EnemyBehavior from "./sections/EnemyBehavior";

export default function EnemyInspector({ selected, update }) {
  return (
    <>
      {/* Basic identifying fields (name, id, etc.) */}
      <EnemyIdentity selected={selected} update={update} />

      {/* Sprite / visual configuration */}
      <EnemyImage selected={selected} update={update} />

      {/* Move list configuration (attacks, abilities, etc.) */}
      <EnemyMoves selected={selected} update={update} />

      {/* AI logic / behavior rules */}
      <EnemyBehavior selected={selected} update={update} />
    </>
  );
}