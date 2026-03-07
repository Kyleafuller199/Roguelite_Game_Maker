/**
 * CardInspector.jsx
 *
 * High-level container for editing Card assets inside the editor.
 *
 * Responsibility:
 * - Composes all card-related inspector sections in a fixed order.
 * - Mirrors the top-level card JSON structure.
 * - Passes the currently selected card (`selected`) and the editor update
 *   function (`update`) down to each section.
 *
 * Data Flow:
 * - `selected` is the active card asset being edited.
 * - `update` applies partial patches to the selected card in editor state.
 */

import CardIdentity from "./sections/CardIdentity";
import CardImage from "./sections/CardImage";
import CardEffects from "./sections/CardEffects";
import CardScaling from "./sections/CardScaling";
import CardRules from "./sections/CardRules";

/**
 * CardInspector
 *
 * @param {object} selected - The currently selected card entity
 * @param {Function} update - Update handler for card mutations (provided by EditorInspector)
 */
export default function CardInspector({ selected, update }) {
  return (
    <>
      <CardIdentity selected={selected} update={update} />
      <CardImage selected={selected} update={update} />
      <CardEffects selected={selected} update={update} />
      <CardScaling selected={selected} update={update} />
      <CardRules selected={selected} update={update} />
    </>
  );
}