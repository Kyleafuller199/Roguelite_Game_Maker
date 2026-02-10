/**
 * EnemyPreview.jsx
 * Live preview for an enemy asset.
 */
export default function EnemyPreview({ selected }) {
    return (
      <div style={{ opacity: 0.9 }}>
        <div><b>{selected.name ?? "Unnamed Enemy"}</b></div>
        <div>HP: {selected.hp ?? 1}</div>
      </div>
    );
  }