/**
 * EnemyImage.jsx
 * Image section for the enemy inspector — V2 file picker.
 * Folder is derived from enemy type so the picker shows the right sprites.
 * enemy.imageUrl stores the selected filename (e.g. "goblin.png")
 */

import InspectorSection from "../../../shared/InspectorSection";
import ImagePicker from "../../../shared/ImagePicker";

export default function EnemyImage({ selected, update }) {
  const type = selected.identity?.type ?? "basic";
  const folder = `monsters/${type}`;

  return (
    <InspectorSection title="Image" defaultOpen={false}>
      <ImagePicker
        folder={folder}
        value={selected.imageUrl ?? ""}
        onChange={(file) => update({ imageUrl: file })}
      />
    </InspectorSection>
  );
}
