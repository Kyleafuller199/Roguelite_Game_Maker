export default function HealthBar({ current, max }) {
  const pct   = Math.max(0, Math.min(1, current / max));
  const color = pct > 0.5 ? "#3a8a4a" : pct > 0.25 ? "#c07820" : "#8a2020";
  return (
    <div style={{ width: 140, height: 6, borderRadius: 999, background: "rgba(0,0,0,0.5)", overflow: "hidden" }}>
      <div style={{ width: `${pct * 100}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.3s" }} />
    </div>
  );
}
