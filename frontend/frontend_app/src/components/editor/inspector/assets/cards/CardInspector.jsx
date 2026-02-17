/**
 * CardInspector.jsx
 *
 * Card inspector composition.
 *
 * Responsibilities:
 * - Renders the full set of card inspector sections
 * - Keeps section order aligned with the card JSON structure
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