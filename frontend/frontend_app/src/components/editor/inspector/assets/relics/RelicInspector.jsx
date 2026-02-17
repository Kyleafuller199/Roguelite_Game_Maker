/**
 * RelicInspector.jsx
 *
 * High-level container for editing Relic assets inside the editor.
 *
 * Responsibility:
 * - Composes all relic-related inspector sections in a fixed order.
 * - Mirrors the top-level relic JSON structure.
 * - Passes the currently selected relic (`selected`) and the editor update
 *   function (`update`) down to each section.
 *
 * Data Flow:
 * - `selected` is the active relic asset being edited.
 * - `update` applies partial patches to the selected relic in editor state.
 */

import RelicIdentity from "./sections/RelicIdentity";
import RelicImage from "./sections/RelicImage";
import RelicEffects from "./sections/RelicEffects";
import RelicTriggers from "./sections/RelicTriggers";

export default function RelicInspector({ selected, update }) {
  return (
    <>
      {/* Basic identifying fields (name, rarity, etc.) */}
      <RelicIdentity selected={selected} update={update} />

      {/* Visual reference (V1: url; later: imageId from asset library) */}
      <RelicImage selected={selected} update={update} />

      {/* Effect list (what the relic does) */}
      <RelicEffects selected={selected} update={update} />

      {/* Trigger configuration (when effects apply) */}
      <RelicTriggers selected={selected} update={update} />
    </>
  );
}