/**
 * RelicPreview.jsx
 * Live preview for a relic asset.
 * Layout: image floating above a description box (name, rarity, triggers + effects)
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
  Starter:  "#a0522d",
};

const EVENT_LABELS = {
  startOfCombat: "At the start of combat",
  startOfTurn:   "At the start of each turn",
  endOfTurn:     "At the end of each turn",
  endOfCombat:   "At the end of combat",
  cardPlayed:    "When a card is played",
  cardDrawn:     "When a card is drawn",
  damageTaken:   "When you take damage",
};

const TARGET_LABELS = {
  selectedEnemy: "the selected enemy",
  randomEnemy:   "a random enemy",
  allEnemies:    "all enemies",
  self:          "self",
  player:        "the player",
};

function N({ color, children }) {
  return <span style={{ color, fontWeight: 700 }}>{children}</span>;
}

function effectText(eff, rarityColor) {
  const val = eff.baseValue ?? 0;
  const tgt = TARGET_LABELS[eff.target] ?? eff.target ?? "";
  const rpt = (eff.repeat ?? 1) > 1 ? ` x${eff.repeat}` : "";
  const c   = rarityColor;

  switch (eff.effectType) {
    case "damage":     return <>deal <N color={c}>{val}</N> damage to {tgt}{rpt}</>;
    case "block":      return <>gain <N color={c}>{val}</N> Block{tgt ? ` (${tgt})` : ""}{rpt}</>;
    case "heal":       return <>heal <N color={c}>{val}</N> HP{tgt ? ` (${tgt})` : ""}{rpt}</>;
    case "draw":       return <>draw <N color={c}>{val}</N> card{val !== 1 ? "s" : ""}</>;
    case "gainEnergy": return <>gain <N color={c}>{val}</N> Energy</>;
    case "weak":       return <>apply <N color={c}>{val}</N> Weak to {tgt}{rpt}</>;
    case "vulnerable": return <>apply <N color={c}>{val}</N> Vulnerable to {tgt}{rpt}</>;
    case "frail":      return <>apply <N color={c}>{val}</N> Frail to {tgt}{rpt}</>;
    case "strength":   return <>apply <N color={c}>{val}</N> Strength to {tgt}{rpt}</>;
    case "dexterity":  return <>apply <N color={c}>{val}</N> Dexterity to {tgt}{rpt}</>;
    default:           return <>{eff.effectType} <N color={c}>{val}</N>{tgt ? ` -> ${tgt}` : ""}{rpt}</>;
  }
}

export default function RelicPreview({ selected }) {
  const name     = selected.identity?.name ?? selected.name ?? "Unnamed Relic";
  const rarity   = selected.identity?.rarity ?? selected.rarity ?? "Common";
  const effects  = selected.effects  ?? [];
  const triggers = selected.triggers ?? [];

  const rarityColor = RARITY_COLOR[rarity] ?? "#888";
  const effectById  = new Map(effects.map((e) => [e.id, e]));

  const triggerLines = triggers.map((trg) => ({
    id: trg.id,
    event: trg.event,
    effects: (trg.effectIds ?? []).map((id) => effectById.get(id)).filter(Boolean),
  }));

  const boundIds      = new Set(triggers.flatMap((t) => t.effectIds ?? []));
  const unboundEffects = effects.filter((e) => !boundIds.has(e.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 24, paddingBottom: 32, boxSizing: "border-box" }}>

      {/* Image */}
      <div style={{ width: 380, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected.imageUrl ? (
          <img
            src={`${API_BASE}/api/assets/file/?path=relics/${selected.imageUrl}`}
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
        border: `2px solid ${rarityColor}44`,
        boxShadow: `0 0 20px ${rarityColor}22`,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxSizing: "border-box",
      }}>

        {/* Name */}
        <div style={{ fontSize: 17, fontWeight: 700, color: "#e5e5e5" }}>{name}</div>

        {/* Rarity chip */}
        <span style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
          padding: "3px 10px", borderRadius: 999,
          backgroundColor: rarityColor + "22", color: rarityColor,
          border: `1px solid ${rarityColor}44`,
        }}>
          {rarity}
        </span>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />

        {/* Triggers + unbound effects */}
        {triggerLines.length === 0 && unboundEffects.length === 0 ? (
          <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>No effects.</div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {triggerLines.map((trg) => (
              <div key={trg.id} style={{ fontSize: 14, color: "#ddd", textAlign: "center", lineHeight: 1.7 }}>
                <span style={{ color: "#888", fontStyle: "italic" }}>
                  {EVENT_LABELS[trg.event] ?? trg.event}:{" "}
                </span>
                {trg.effects.length === 0 ? (
                  <span style={{ color: "#555" }}>no effects bound.</span>
                ) : (
                  trg.effects.map((eff, i) => (
                    <span key={eff.id}>
                      {effectText(eff, rarityColor)}
                      {i < trg.effects.length - 1 ? "; " : "."}
                    </span>
                  ))
                )}
              </div>
            ))}
            {unboundEffects.map((eff) => (
              <div key={eff.id} style={{ fontSize: 14, color: "#ddd", textAlign: "center", lineHeight: 1.7 }}>
                {effectText(eff, rarityColor)}.
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
