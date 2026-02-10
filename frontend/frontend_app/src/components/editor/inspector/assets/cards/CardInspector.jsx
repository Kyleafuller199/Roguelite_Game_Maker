/**
 * CardInspector.jsx
 * Composes card inspector sections (mirrors card JSON structure).
 */
import CardIdentitySection from "./sections/CardIdentity";
import CardImageSection from "./sections/CardImage";
import CardEffectsSection from "./sections/CardEffects";
import CardScalingSection from "./sections/CardScaling";
import CardRulesSection from "./sections/CardRules";

export default function CardInspector({ selected, update }) {
  return (
    <>
      <CardIdentitySection selected={selected} update={update} />
      <CardImageSection selected={selected} update={update} />
      <CardEffectsSection selected={selected} update={update} />
      <CardScalingSection selected={selected} update={update} />
      <CardRulesSection selected={selected} update={update} />
    </>
  );
}