/**
 * PotionImage.jsx
 * Image section for the potion inspector — V2 file picker.
 * potion.imageUrl stores the selected filename (e.g. "fire_potion.png")
 */

import InspectorSection from "../../../shared/InspectorSection";
import ImagePicker from "../../../shared/ImagePicker";

export default function PotionImage({ selected, update }) {
  return (
    <InspectorSection title="Image">
      <ImagePicker
        folder="potions"
        value={selected.imageUrl ?? ""}
        onChange={(file) => update({ imageUrl: file })}
      />
    </InspectorSection>
  );
}
