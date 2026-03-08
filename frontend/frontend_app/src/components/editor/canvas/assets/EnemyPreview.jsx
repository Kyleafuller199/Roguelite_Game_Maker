/**
 * EnemyPreview.jsx
 * Live preview for an enemy asset.
 * Layout: large image floating above a description box
 * Description: name → [type | hp | block] tag bar → divider → moves in cycle order
 */

const API_BASE = "http://localhost:8000";

const TYPE_COLOR = {
  basic: "#888888",
  elite: "#9b59b6",
  boss:  "#c0392b",
};

const TARGET_LABELS = {
  player:        "the player",
  self:          "self",
  selectedEnemy: "a selected enemy",
  randomEnemy:   "a random enemy",
  allEnemies:    "all enemies",
};

function N({ color, children }) {
  return <span style={{ color, fontWeight: 700 }}>{children}</span>;
}

function effectSummary(eff, typeColor) {
  const val = eff.baseValue ?? 0;
  const tgt = TARGET_LABELS[eff.target] ?? eff.target ?? "";
  const rpt = (eff.repeat ?? 1) > 1 ? ` x${eff.repeat}` : "";
  const c   = typeColor;

  switch (eff.effectType) {
    case "damage":     return <>Deal <N color={c}>{val}</N> damage to {tgt}{rpt}.</>;
    case "block":      return <>Gain <N color={c}>{val}</N> Block{tgt ? ` (${tgt})` : ""}{rpt}.</>;
    case "heal":       return <>Heal <N color={c}>{val}</N> HP{tgt ? ` (${tgt})` : ""}{rpt}.</>;
    case "draw":       return <>Draw <N color={c}>{val}</N> card{val !== 1 ? "s" : ""}.</>;
    case "gainEnergy": return <>Gain <N color={c}>{val}</N> Energy.</>;
    case "weak":       return <>Apply <N color={c}>{val}</N> Weak to {tgt}{rpt}.</>;
    case "vulnerable": return <>Apply <N color={c}>{val}</N> Vulnerable to {tgt}{rpt}.</>;
    case "frail":      return <>Apply <N color={c}>{val}</N> Frail to {tgt}{rpt}.</>;
    case "strength":   return <>Apply <N color={c}>{val}</N> Strength to {tgt}{rpt}.</>;
    case "dexterity":  return <>Apply <N color={c}>{val}</N> Dexterity to {tgt}{rpt}.</>;
    default:           return <>{eff.effectType} <N color={c}>{val}</N>{tgt ? ` -> ${tgt}` : ""}{rpt}.</>;
  }
}

export default function EnemyPreview({ selected }) {
  const identity = selected.identity ?? {};
  const name     = identity.name ?? "Unnamed Enemy";
  const type     = identity.type ?? "basic";
  const hp       = identity.startingHealth ?? "?";
  const block    = identity.startingBlock ?? 0;
  const moves    = selected.moves ?? [];
  const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };

  const typeColor  = TYPE_COLOR[type] ?? "#888";
  const moveById   = new Map(moves.map((m) => [m.id, m]));
  const cycleOrder = behavior.cycleOrder ?? [];

  // Ordered moves for display; fall back to moves array order if no cycle defined
  const orderedMoves = cycleOrder.length > 0
    ? cycleOrder.map((id) => moveById.get(id)).filter(Boolean)
    : moves;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 24, paddingBottom: 32, boxSizing: "border-box" }}>

      {/* Image */}
      <div style={{ width: 380, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected.imageUrl ? (
          <img
            src={`${API_BASE}/api/assets/file/?path=monsters/${type}/${selected.imageUrl}`}
            alt={name}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : (
          <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>No image</div>
        )}
      </div>

      {/* Description box */}
      <div style={{
        width: 420,
        borderRadius: 14,
        backgroundColor: "#1e1c1b",
        border: `2px solid ${typeColor}44`,
        boxShadow: `0 0 20px ${typeColor}22`,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxSizing: "border-box",
      }}>

        {/* Name */}
        <div style={{ fontSize: 17, fontWeight: 700, color: "#e5e5e5" }}>{name}</div>

        {/* Tag bar: [Type] [HP] [Block] */}
        <div style={{ display: "flex", width: "100%", borderRadius: 8, overflow: "hidden" }}>
          <div style={{
            flex: 1,
            backgroundColor: typeColor + "33",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: typeColor,
            textTransform: "uppercase", letterSpacing: 1,
            padding: "6px 0",
          }}>
            {type}
          </div>
          <div style={{
            flex: 1,
            backgroundColor: "#c0392b22",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#e07070",
            padding: "6px 0", gap: 4,
          }}>
            ♥ {hp} HP
          </div>
          <div style={{
            flex: 1,
            backgroundColor: "#2a4a6a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#7ab8e8",
            padding: "6px 0", gap: 4,
          }}>
            {block} Block
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />

        {/* Moves */}
        {orderedMoves.length === 0 ? (
          <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>No moves defined.</div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {orderedMoves.map((move, i) => (
              <div key={move.id}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e5e5e5", marginBottom: 3 }}>
                  {i + 1}. {move.name ?? "Unnamed Move"}
                </div>
                {(move.effects ?? []).length === 0 ? (
                  <div style={{ fontSize: 12, color: "#555", fontStyle: "italic", paddingLeft: 14 }}>No effects.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 14 }}>
                    {(move.effects ?? []).map((eff, j) => (
                      <div key={eff.id ?? j} style={{ fontSize: 13, color: "#bbb" }}>
                        {effectSummary(eff, typeColor)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
