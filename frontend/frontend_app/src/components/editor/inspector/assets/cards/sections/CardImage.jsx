/**
 * CardImage.jsx
 *
 * Inspector section responsible for editing the card's visual reference.
 *
 * V1 Storage:
 * - Stores a direct `imageUrl` string on the card object.
 *
 * JSON Shape Controlled Here:
 * card.imageUrl = string
 */

import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";

export default function CardImage({ selected, update }) {
  const imageUrl = selected.imageUrl ?? "";

  return (
    <InspectorSection title="Image">
      <Label>Image URL (V1)</Label>
      <input
        value={imageUrl}
        onChange={(e) => update({ imageUrl: e.target.value })}
        placeholder="https://..."
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Card"
          style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
        />
      ) : (
        <div style={{ opacity: 0.7, fontSize: 14 }}>
          No image selected (later: choose from asset library / upload)
        </div>
      )}
    </InspectorSection>
  );
}
