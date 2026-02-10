/**
 * RelicInspector.jsx
 * Composes relic inspector sections (mirrors card JSON structure).
 */

import RelicIdentity from "./sections/RelicIdentity";
import RelicImage from "./sections/RelicImage";
import RelicEffects from "./sections/RelicEffects";
import RelicTriggers from "./sections/RelicTriggers";

export default function RelicInspector({ selected, update }) {
  return (
    <>
      <RelicIdentity selected={selected} update={update} />
      <RelicImage selected={selected} update={update} />
      <RelicEffects selected={selected} update={update} />
      <RelicTriggers selected={selected} update={update} />
    </>
  );
}