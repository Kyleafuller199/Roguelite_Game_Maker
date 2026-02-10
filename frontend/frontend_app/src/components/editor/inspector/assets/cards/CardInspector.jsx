/**
 * CardInspector.jsx
 * Composes card inspector sections (mirrors card JSON structure).
 */

import CardIdentity from "./sections/CardIdentity";
import CardImage from "./sections/CardImage";
import CardEffects from "./sections/CardEffects";
import CardScaling from "./sections/CardScaling";
import CardRules from "./sections/CardRules";

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