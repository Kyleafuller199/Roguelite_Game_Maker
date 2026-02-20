/**
 * EnemyInspector.jsx
 *
 * High-level container for editing Enemy assets inside the editor.
 *
 * Responsibility:
 * - Composes all enemy-related inspector sections in a fixed order.
 * - Mirrors the top-level enemy JSON structure.
 * - Passes the currently selected enemy (`selected`) and the editor update
 *   function (`update`) down to each section.
 *
 * Data Flow:
 * - `selected` is the active enemy asset being edited.
 * - `update` applies partial patches to the selected enemy in editor state.
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