/**
 * RelicImage.jsx
 * Image section: display selected image + placeholder for adding/selecting images.
 * V1: stores an imageUrl string on the relic.
 */
import Label from "../../../shared/Label";

export default function RelicImage({ selected, update }) {
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

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Relic"
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