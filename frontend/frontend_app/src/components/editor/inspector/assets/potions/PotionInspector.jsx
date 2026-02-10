/**
 * PotionInspector.jsx
 * Composes potion inspector sections (mirrors potion JSON structure).
 */
import PotionIdentity from "./sections/PotionIdentity";
import PotionImage from "./sections/PotionImage";
import PotionEffects from "./sections/PotionEffects";

export default function PotionInspector({ selected, update }) {
  return (
    <>
      <PotionIdentity selected={selected} update={update} />
      <PotionImage selected={selected} update={update} />
      <PotionEffects selected={selected} update={update} />
    </>
  );
}