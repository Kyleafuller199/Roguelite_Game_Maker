/**
 * RelicImage.jsx
 * Image section for the relic inspector — V2 file picker.
 * relic.imageUrl stores the selected filename (e.g. "ancient_coin.png")
 */

import InspectorSection from "../../../shared/InspectorSection";
import ImagePicker from "../../../shared/ImagePicker";

export default function RelicImage({ selected, update }) {
  return (
    <InspectorSection title="Image">
      <ImagePicker
        folder="relics"
        value={selected.imageUrl ?? ""}
        onChange={(file) => update({ imageUrl: file })}
      />
    </InspectorSection>
  );
}
