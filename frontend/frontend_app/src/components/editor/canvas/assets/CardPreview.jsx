/**
 * CardPreview.jsx
 * Card preview — 400×607 shell with two sections.
 * Top: title (48px) + art (16:9) + type/rarity tag
 * Bottom: effect description box (240px)
 */

const API_BASE = "http://localhost:8000";

const RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
  Curse:    "#8b4fa8",
};

const TYPE_COLOR = {
  Attack: "#8b2020",
  Skill:  "#2a7a40",
  Power:  "#a0305a",
  Curse:  "#5a3070",
};

const TARGET_LABELS = {
  selectedEnemy: "the selected enemy",
  randomEnemy:   "a random enemy",
  allEnemies:    "all enemies",
  self:          "self",
  player:        "the player",
};

const SCALE_LABELS = {
  timesPlayedThisCombat: "times played",
  cardsPlayedThisTurn:   "cards played",
  cardsInHand:           "cards in hand",
  turnsElapsed:          "turns elapsed",
  energySpentThisTurn:   "energy spent",
  missingHp:             "missing HP",
};

function N({ color, children }) {
  return <span style={{ color, fontWeight: 700 }}>{children}</span>;
}

function V({ color, children }) {
  return <N color={color}>{children}</N>;
}

const TRIGGER_PREFIX = {
  onDraw:    "When drawn: ",
  onDiscard: "When discarded: ",
  onExhaust: "When exhausted: ",
};

function EffectLine({ eff, scaling, typeColor }) {
  const val   = eff.baseValue ?? 0;
  const tgt   = TARGET_LABELS[eff.target] ?? eff.target ?? "";
  const rpt   = (eff.repeat ?? 1) > 1 ? ` x${eff.repeat}` : "";
  const scale = scaling.find((s) => s.appliesToEffectId === eff.id);
  const scaleEl = scale
    ? <> (+<N color={typeColor}>{scale.amountPerUnit}</N> per {SCALE_LABELS[scale.basedOn] ?? scale.basedOn})</>
    : null;

  const c = typeColor;
  let content;
  switch (eff.effectType) {
    case "damage":     content = <>Deal <V color={c}>{val}</V> damage to {tgt}{rpt}{scaleEl}.</>; break;
    case "block":      content = <>Gain <V color={c}>{val}</V> Block{tgt ? ` (${tgt})` : ""}{rpt}{scaleEl}.</>; break;
    case "heal":       content = <>Heal <V color={c}>{val}</V> HP{tgt ? ` (${tgt})` : ""}{rpt}{scaleEl}.</>; break;
    case "draw":       content = <>Draw <V color={c}>{val}</V> card{val !== 1 ? "s" : ""}{scaleEl}.</>; break;
    case "gainEnergy": content = <>Gain <V color={c}>{val}</V> Energy{scaleEl}.</>; break;
    case "weak":       content = <>Apply <V color={c}>{val}</V> Weak to {tgt}{rpt}{scaleEl}.</>; break;
    case "vulnerable": content = <>Apply <V color={c}>{val}</V> Vulnerable to {tgt}{rpt}{scaleEl}.</>; break;
    case "frail":      content = <>Apply <V color={c}>{val}</V> Frail to {tgt}{rpt}{scaleEl}.</>; break;
    case "strength":   content = <>Apply <V color={c}>{val}</V> Strength to {tgt}{rpt}{scaleEl}.</>; break;
    case "dexterity":  content = <>Apply <V color={c}>{val}</V> Dexterity to {tgt}{rpt}{scaleEl}.</>; break;
    default:           content = <>{eff.effectType} <V color={c}>{val}</V>{tgt ? ` -> ${tgt}` : ""}{rpt}{scaleEl}.</>;
  }

  const prefix = TRIGGER_PREFIX[eff.trigger];
  return (
    <div style={{ textAlign: "center", lineHeight: 1.7 }}>
      {prefix && <span style={{ color: "#888", fontStyle: "italic" }}>{prefix}</span>}
      {content}
    </div>
  );
}

export default function CardPreview({ selected }) {
  const rarity      = selected.rarity ?? "Common";
  const type        = selected.type   ?? "Attack";
  const cost        = selected.cost   ?? 0;
  const effects     = selected.effects ?? [];
  const scaling     = selected.scaling ?? [];
  const activeRules = ["unplayable", "ethereal", "exhaust", "innate", "retain"]
    .filter((r) => selected[r]);

  const rarityColor = RARITY_COLOR[rarity] ?? "#888";
  const typeColor   = TYPE_COLOR[type]     ?? "#888";

  // Layout constants
  const CARD_W   = 400;
  const PAD_H    = 16;   // horizontal padding
  const PAD_TOP  = 16;
  const PAD_BOT  = 32;
  const GAP      = 32;
  const TITLE_H  = 48;
  const BOTTOM_H = 240;
  const TAG_H    = 32;
  const IMAGE_H  = Math.round((CARD_W - PAD_H * 2) * 9 / 16); // 207 (16:9)
  const TOP_H    = TITLE_H + IMAGE_H + TAG_H;                  // 287
  const INNER_H  = TOP_H + GAP + BOTTOM_H;                     // 559
  const CARD_H   = INNER_H + PAD_TOP + PAD_BOT;                // 607

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>

      {/* Card shell */}
      <div style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 16,
        backgroundColor: "#141312",
        border: `2px solid ${rarityColor}44`,
        boxShadow: `0 0 24px ${rarityColor}22`,
        padding: `${PAD_TOP}px ${PAD_H}px ${PAD_BOT}px`,
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        boxSizing: "border-box",
        flexShrink: 0,
      }}>

        {/* TOP SECTION */}
        <div style={{
          height: TOP_H,
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>

          {/* Title bar */}
          <div style={{
            height: TITLE_H,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 14px",
            backgroundColor: "#1e1c1b",
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8,
              backgroundColor: "#111",
              border: `1px solid ${rarityColor}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>
              {cost}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#e5e5e5" }}>
              {selected.name ?? "Unnamed Card"}
            </span>
          </div>

          {/* Art */}
          <div style={{
            height: IMAGE_H,
            flexShrink: 0,
            backgroundColor: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {selected.imageUrl ? (
              <img
                src={`${API_BASE}/api/assets/file/?path=cards/${selected.imageUrl}`}
                alt={selected.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ fontSize: 12, color: "#333", fontStyle: "italic" }}>No image</div>
            )}
          </div>

          {/* Type / rarity tag */}
          <div style={{
            height: TAG_H,
            flexShrink: 0,
            borderRadius: "0 0 12px 12px",
            overflow: "hidden",
            display: "flex",
          }}>
            <div style={{
              flex: 1,
              backgroundColor: rarityColor + "33",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: rarityColor,
              textTransform: "uppercase", letterSpacing: 1,
            }}>
              {rarity}
            </div>
            <div style={{
              flex: 1,
              backgroundColor: typeColor + "88",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#e5e5e5",
              textTransform: "uppercase", letterSpacing: 1,
            }}>
              {type}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div style={{
          height: BOTTOM_H,
          borderRadius: 12,
          backgroundColor: "#1e1c1b",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 20px",
          gap: 8,
        }}>
          {effects.length === 0 ? (
            <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>No effects.</div>
          ) : (
            effects.map((e, i) => (
              <div key={e.id ?? i} style={{ fontSize: 15, color: "#ddd", width: "100%" }}>
                <EffectLine eff={e} scaling={scaling} typeColor={typeColor} />
              </div>
            ))
          )}

          {activeRules.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, justifyContent: "center" }}>
              {activeRules.map((r) => (
                <span key={r} style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 999,
                  backgroundColor: "#252525", color: "#aaa",
                  border: "1px solid #3a3a3a", textTransform: "capitalize",
                }}>
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
