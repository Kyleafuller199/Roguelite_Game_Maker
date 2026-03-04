/**
 * CardImage.jsx
 * Image section for the card inspector — V2 file picker.
 * card.imageUrl stores the selected filename (e.g. "fireball.png")
 */

import InspectorSection from "../../../shared/InspectorSection";
import ImagePicker from "../../../shared/ImagePicker";

export default function CardImage({ selected, update }) {
  return (
    <InspectorSection title="Image">
      <ImagePicker
        folder="card logos"
        value={selected.imageUrl ?? ""}
        onChange={(file) => update({ imageUrl: file })}
      />
    </InspectorSection>
  );
}
