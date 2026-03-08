/**
 * PotionPreview.jsx
 * Live preview for a potion asset.
 * Layout: large image floating above a description box (name, rarity, usability, effects)
 */

const API_BASE = "http://localhost:8000";

const RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
};

const USE_LABELS = {
  combatOnly: "Combat Only",
  anyTime:    "Anytime",
};

const TARGET_LABELS = {
  selectedEnemy: "the selected enemy",
  randomEnemy:   "a random enemy",
  allEnemies:    "all enemies",
  self:          "self",
};

function N({ color, children }) {
  return <span style={{ color, fontWeight: 700 }}>{children}</span>;
}

function EffectLine({ eff, rarityColor }) {
  const val = eff.baseValue ?? 0;
  const tgt = TARGET_LABELS[eff.target] ?? eff.target ?? "";
  const rpt = (eff.repeat ?? 1) > 1 ? ` x${eff.repeat}` : "";
  const c   = rarityColor;

  let content;
  switch (eff.effectType) {
    case "damage":     content = <>Deal <N color={c}>{val}</N> damage to {tgt}{rpt}.</>; break;
    case "block":      content = <>Gain <N color={c}>{val}</N> Block{tgt ? ` (${tgt})` : ""}{rpt}.</>; break;
    case "heal":       content = <>Heal <N color={c}>{val}</N> HP{tgt ? ` (${tgt})` : ""}{rpt}.</>; break;
    case "draw":       content = <>Draw <N color={c}>{val}</N> card{val !== 1 ? "s" : ""}.</>; break;
    case "gainEnergy": content = <>Gain <N color={c}>{val}</N> Energy.</>; break;
    case "weak":       content = <>Apply <N color={c}>{val}</N> Weak to {tgt}{rpt}.</>; break;
    case "vulnerable": content = <>Apply <N color={c}>{val}</N> Vulnerable to {tgt}{rpt}.</>; break;
    case "frail":      content = <>Apply <N color={c}>{val}</N> Frail to {tgt}{rpt}.</>; break;
    case "strength":   content = <>Apply <N color={c}>{val}</N> Strength to {tgt}{rpt}.</>; break;
    case "dexterity":  content = <>Apply <N color={c}>{val}</N> Dexterity to {tgt}{rpt}.</>; break;
    default:           content = <>{eff.effectType} <N color={c}>{val}</N>{tgt ? ` -> ${tgt}` : ""}{rpt}.</>;
  }

  return <div style={{ textAlign: "center", lineHeight: 1.7 }}>{content}</div>;
}

export default function PotionPreview({ selected }) {
  const name       = selected.identity?.name ?? selected.name ?? "Unnamed Potion";
  const rarity     = selected.identity?.rarity ?? selected.rarity ?? "Common";
  const useContext = selected.identity?.useContext ?? "anyTime";
  const effects    = selected.effects ?? [];

  const rarityColor = RARITY_COLOR[rarity] ?? "#888";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 24, paddingBottom: 32, boxSizing: "border-box" }}>

      {/* Image — large, floating, no box */}
      <div style={{ width: 340, height: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected.imageUrl ? (
          <img
            src={`${API_BASE}/api/assets/file/?path=potions/${selected.imageUrl}`}
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
        padding: "20px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxSizing: "border-box",
      }}>

        {/* Name */}
        <div style={{ fontSize: 17, fontWeight: 700, color: "#e5e5e5" }}>{name}</div>

        {/* Rarity + use context chips */}
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
            padding: "3px 10px", borderRadius: 999,
            backgroundColor: rarityColor + "22", color: rarityColor,
            border: `1px solid ${rarityColor}44`,
          }}>
            {rarity}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
            padding: "3px 10px", borderRadius: 999,
            backgroundColor: "#2a2a2a", color: "#aaa",
            border: "1px solid #3a3a3a",
          }}>
            {USE_LABELS[useContext] ?? "Anytime"}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, backgroundColor: "rgba(255,255,255,0.07)", margin: "2px 0" }} />

        {/* Effects */}
        {effects.length === 0 ? (
          <div style={{ fontSize: 15, color: "#555", fontStyle: "italic" }}>No effects.</div>
        ) : (
          effects.map((e, i) => (
            <div key={e.id ?? i} style={{ fontSize: 15, color: "#ddd", width: "100%" }}>
              <EffectLine eff={e} rarityColor={rarityColor} />
            </div>
          ))
        )}
      </div>

    </div>
  );
}
