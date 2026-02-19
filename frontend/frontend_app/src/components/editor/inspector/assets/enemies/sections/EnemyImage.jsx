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
 */

import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";

export default function EnemyImage({ selected, update }) {
  const imageUrl = selected.imageUrl ?? "";

  return (
    <InspectorSection title="Image" defaultOpen={false}>
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
    </InspectorSection>
  );
}