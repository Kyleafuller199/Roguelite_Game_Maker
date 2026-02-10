/**
 * RelicPreview.jsx
 * Live preview for a relic asset.
 */
export default function RelicPreview({ selected }) {
    return (
      <div style={{ opacity: 0.9 }}>
        <div><b>{selected.name ?? "Unnamed Relic"}</b></div>
        <div>Tier: {selected.tier ?? "Common"}</div>
      </div>
    );
  }