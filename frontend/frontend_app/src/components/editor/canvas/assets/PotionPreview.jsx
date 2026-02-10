/**
 * PotionPreview.jsx
 * Live preview for a potion asset.
 */
export default function PotionPreview({ selected }) {
    return (
      <div style={{ opacity: 0.9 }}>
        <div><b>{selected.name ?? "Unnamed Potion"}</b></div>
        <div>Rarity: {selected.rarity ?? "Common"}</div>
        <div>Uses: {selected.uses ?? 1}</div>
      </div>
    );
  }