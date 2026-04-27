export default function CardPile({ label, count, faded = false }) {
  return (
    <div style={{
      flexShrink: 0, width: 60,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
    }}>
      <div style={{
        width: 44, height: 60, borderRadius: 6,
        background: faded ? "#2a2018" : "#1e1c1b",
        border: `1px solid ${faded ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 800,
        color: faded ? "#555" : "#e5e5e5",
        boxShadow: count > 0 ? "2px 2px 0 #111, 4px 4px 0 #0a0a0a" : "none",
      }}>
        {count}
      </div>
      <span style={{ fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </span>
    </div>
  );
}
