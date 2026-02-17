/**
 * PotionInspector.jsx
 *
 * High-level container for editing Potion assets inside the editor.
 *
 * Responsibility:
 * - Composes all potion-related inspector sections in a fixed order.
 * - Mirrors the top-level potion JSON structure.
 * - Passes the currently selected potion (`selected`) and the editor update
 *   function (`update`) down to each section.
 *
 * Data Flow:
 * - `selected` is the active potion asset being edited.
 * - `update` applies partial patches to the selected potion in editor state.
 */

import PotionIdentity from "./sections/PotionIdentity";
import PotionImage from "./sections/PotionImage";
import PotionEffects from "./sections/PotionEffects";

export default function PotionInspector({ selected, update }) {
  return (
    <>
      {/* Basic identifying fields (name, rarity, etc.) */}
      <PotionIdentity selected={selected} update={update} />

      {/* Visual reference for the potion (V1: url; later: imageId from asset library) */}
      <PotionImage selected={selected} update={update} />

      {/* Effect list / behavior (what the potion does when used) */}
      <PotionEffects selected={selected} update={update} />
    </>
  );
}