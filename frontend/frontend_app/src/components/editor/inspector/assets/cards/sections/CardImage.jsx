/**
 * CardImage.jsx
 *
 * Card image section.
 *
 * Responsibilities:
 * - Edits the card image URL (V1)
 * - Shows a preview of the image when a URL is present
 *
 * Data model (V1):
 * - Card stores an imageUrl string: selected.imageUrl
 *
 * Future (V2):
 * - Replace imageUrl with imageId referencing the asset library
 * - Support selecting/uploading images rather than typing URLs
 */

import Label from "../../../shared/Label";

/**
 * CardImage
 *
 * @param {object} selected - Currently selected card
 * @param {Function} update - Update handler (partial patch function)
 */
export default function CardImage({ selected, update }) {
  const imageUrl = selected.imageUrl ?? "";

  return (
    <div style={{ marginTop: 16 }}>
      {/* Section Title */}
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Image</div>

      {/* Image URL input (V1) */}
      <Label>Image URL (V1)</Label>
      <input
        value={imageUrl}
        onChange={(e) => update({ imageUrl: e.target.value })}
        placeholder="https://..."
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Preview */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Card"
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        />
      ) : (
        <div style={{ opacity: 0.7, fontSize: 14 }}>
          No image selected (later: choose from asset library / upload)
        </div>
      )}
    </div>
  );
}