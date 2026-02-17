/**
 * EnemyImage.jsx
 *
 * Inspector section responsible for editing the enemy's visual reference.
 *
 * V1 Storage:
 * - Stores a direct `imageUrl` string on the enemy object.
 *
 * JSON Shape Controlled Here:
 * enemy.imageUrl = string
 *
 * Future Direction:
 * - Replace `imageUrl` with `imageId` that references an image in the asset library
 *   (normalized storage + reuse across projects/assets).
 *
 * Responsibility:
 * - Provide a simple URL input
 * - Preview the image when a URL is present
 *
 * Note:
 * - This component performs no validation of the URL beyond presence/absence.
 */

import Label from "../../../shared/Label";

export default function EnemyImage({ selected, update }) {
  // Always treat missing value as empty string for controlled input stability
  const imageUrl = selected.imageUrl ?? "";

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Image</div>

      <Label>Image URL (V1)</Label>
      <input
        value={imageUrl}
        onChange={(e) => update({ imageUrl: e.target.value })}
        placeholder="https://..."
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* Simple preview if an image URL exists; otherwise show an empty state message */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Enemy"
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        />
      ) : (
        <div style={{ opacity: 0.7, fontSize: 14 }}>No image selected</div>
      )}
    </div>
  );
}