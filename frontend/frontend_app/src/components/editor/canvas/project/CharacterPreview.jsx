/**
 * CharacterPreview.jsx
 * Live preview for a selected character node in project mode.
 * Layout: character image on top, two-column box below:
 *   left  → starting relic (image + compact description box)
 *   right → starting deck (thumbnail list + "View Cards" modal button)
 */

import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// ── Shared colour tables ──────────────────────────────────────────────────────

const CARD_RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
  Curse:    "#8b4fa8",
  Starter:  "#888888", // same as Common
};

const RELIC_RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
  Boss:     "#a0522d",
  Shop:     "#4a8840",
  Starter:  "#a0522d", // same as Boss
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

const TRIGGER_PREFIX = {
  onDraw:    "When drawn: ",
  onDiscard: "When discarded: ",
  onExhaust: "When exhausted: ",
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

function N({ color, children }) {
  return <span style={{ color, fontWeight: 700 }}>{children}</span>;
}

// ── Mini card (used in modal) ─────────────────────────────────────────────────

function MiniEffectLine({ eff, scaling, typeColor }) {
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
    case "damage":     content = <>Deal <N color={c}>{val}</N> damage to {tgt}{rpt}{scaleEl}.</>; break;
    case "block":      content = <>Gain <N color={c}>{val}</N> Block{tgt ? ` (${tgt})` : ""}{rpt}{scaleEl}.</>; break;
    case "heal":       content = <>Heal <N color={c}>{val}</N> HP{tgt ? ` (${tgt})` : ""}{rpt}{scaleEl}.</>; break;
    case "draw":       content = <>Draw <N color={c}>{val}</N> card{val !== 1 ? "s" : ""}{scaleEl}.</>; break;
    case "gainEnergy": content = <>Gain <N color={c}>{val}</N> Energy{scaleEl}.</>; break;
    case "weak":       content = <>Apply <N color={c}>{val}</N> Weak to {tgt}{rpt}{scaleEl}.</>; break;
    case "vulnerable": content = <>Apply <N color={c}>{val}</N> Vulnerable to {tgt}{rpt}{scaleEl}.</>; break;
    case "frail":      content = <>Apply <N color={c}>{val}</N> Frail to {tgt}{rpt}{scaleEl}.</>; break;
    case "strength":   content = <>Apply <N color={c}>{val}</N> Strength to {tgt}{rpt}{scaleEl}.</>; break;
    case "dexterity":  content = <>Apply <N color={c}>{val}</N> Dexterity to {tgt}{rpt}{scaleEl}.</>; break;
    default:           content = <>{eff.effectType} <N color={c}>{val}</N>{tgt ? ` -> ${tgt}` : ""}{rpt}{scaleEl}.</>;
  }
  const prefix = TRIGGER_PREFIX[eff.trigger];
  return (
    <div style={{ textAlign: "center", lineHeight: 1.6 }}>
      {prefix && <span style={{ color: "#888", fontStyle: "italic" }}>{prefix}</span>}
      {content}
    </div>
  );
}

const MW       = 190;
const MPAD_H   = 10;
const MPAD_TOP = 10;
const MPAD_BOT = 14;
const MGAP     = 12;
const MTITLE_H = 38;
const MTAG_H   = 20;
const MIMAGE_H = Math.round((MW - MPAD_H * 2) * 9 / 16);
const MBOTTOM_H = 130;
const MTOP_H   = MTITLE_H + MIMAGE_H + MTAG_H;
const MCARD_H  = MTOP_H + MGAP + MBOTTOM_H + MPAD_TOP + MPAD_BOT;

function MiniCard({ card, count }) {
  const rarity      = card.rarity ?? "Common";
  const type        = card.type   ?? "Attack";
  const cost        = card.cost   ?? 0;
  const effects     = card.effects ?? [];
  const scaling     = card.scaling ?? [];
  const activeRules = ["unplayable", "ethereal", "exhaust", "innate", "retain"].filter((r) => card[r]);
  const rarityColor = CARD_RARITY_COLOR[rarity] ?? "#888";
  const typeColor   = TYPE_COLOR[type]          ?? "#888";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <div style={{
        width: MW, height: MCARD_H,
        borderRadius: 12, backgroundColor: "#141312",
        border: `2px solid ${rarityColor}44`, boxShadow: `0 0 16px ${rarityColor}22`,
        padding: `${MPAD_TOP}px ${MPAD_H}px ${MPAD_BOT}px`,
        display: "flex", flexDirection: "column", gap: MGAP,
        boxSizing: "border-box", flexShrink: 0,
      }}>
        <div style={{ height: MTOP_H, borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ height: MTITLE_H, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 8px", backgroundColor: "#1e1c1b" }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: "#111", border: `1px solid ${rarityColor}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {cost}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e5e5e5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {card.name ?? "Unnamed Card"}
            </span>
          </div>
          <div style={{ height: MIMAGE_H, flexShrink: 0, backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {card.imageUrl ? (
              <img src={`${API_BASE}/api/assets/file/?path=cards/${card.imageUrl}`} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ fontSize: 10, color: "#333", fontStyle: "italic" }}>No image</div>
            )}
          </div>
          <div style={{ height: MTAG_H, flexShrink: 0, borderRadius: "0 0 8px 8px", overflow: "hidden", display: "flex" }}>
            <div style={{ flex: 1, backgroundColor: rarityColor + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: rarityColor, textTransform: "uppercase", letterSpacing: 0.5 }}>{rarity}</div>
            <div style={{ flex: 1, backgroundColor: typeColor + "88", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#e5e5e5", textTransform: "uppercase", letterSpacing: 0.5 }}>{type}</div>
          </div>
        </div>
        <div style={{ height: MBOTTOM_H, borderRadius: 8, backgroundColor: "#1e1c1b", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 10px", gap: 4, overflow: "hidden" }}>
          {effects.length === 0 ? (
            <div style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>No effects.</div>
          ) : (
            effects.map((e, i) => (
              <div key={e.id ?? i} style={{ fontSize: 13, color: "#ddd", width: "100%" }}>
                <MiniEffectLine eff={e} scaling={scaling} typeColor={typeColor} />
              </div>
            ))
          )}
          {activeRules.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4, justifyContent: "center" }}>
              {activeRules.map((r) => (
                <span key={r} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 999, backgroundColor: "#252525", color: "#aaa", border: "1px solid #3a3a3a", textTransform: "capitalize" }}>{r}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 999, padding: "2px 8px" }}>
        ×{count}
      </span>
    </div>
  );
}

// ── Deck modal ────────────────────────────────────────────────────────────────

function DeckModal({ deck, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#1e1c1b",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 24,
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e5e5e5", textTransform: "uppercase", letterSpacing: 1 }}>
            Starting Deck
          </span>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "#aaa", fontSize: 13, padding: "2px 10px", cursor: "pointer" }}
          >
            Close
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {deck.map(({ card, count }, i) => (
            <MiniCard key={card.id ?? i} card={card} count={count} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Relic display ─────────────────────────────────────────────────────────────

function relicEffectText(eff, color) {
  const val = eff.baseValue ?? 0;
  const tgt = TARGET_LABELS[eff.target] ?? eff.target ?? "";
  const rpt = (eff.repeat ?? 1) > 1 ? ` x${eff.repeat}` : "";
  switch (eff.effectType) {
    case "damage":     return <>deal <N color={color}>{val}</N> damage to {tgt}{rpt}</>;
    case "block":      return <>gain <N color={color}>{val}</N> Block{tgt ? ` (${tgt})` : ""}{rpt}</>;
    case "heal":       return <>heal <N color={color}>{val}</N> HP{tgt ? ` (${tgt})` : ""}{rpt}</>;
    case "draw":       return <>draw <N color={color}>{val}</N> card{val !== 1 ? "s" : ""}</>;
    case "gainEnergy": return <>gain <N color={color}>{val}</N> Energy</>;
    case "weak":       return <>apply <N color={color}>{val}</N> Weak to {tgt}{rpt}</>;
    case "vulnerable": return <>apply <N color={color}>{val}</N> Vulnerable to {tgt}{rpt}</>;
    case "frail":      return <>apply <N color={color}>{val}</N> Frail to {tgt}{rpt}</>;
    case "strength":   return <>apply <N color={color}>{val}</N> Strength to {tgt}{rpt}</>;
    case "dexterity":  return <>apply <N color={color}>{val}</N> Dexterity to {tgt}{rpt}</>;
    default:           return <>{eff.effectType} <N color={color}>{val}</N>{tgt ? ` -> ${tgt}` : ""}{rpt}</>;
  }
}

function RelicDisplay({ relic }) {
  if (!relic) {
    return <div style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>None selected</div>;
  }

  const name        = relic.identity?.name ?? relic.name ?? "Unnamed Relic";
  const rarity      = relic.identity?.rarity ?? relic.rarity ?? "Common";
  const effects     = relic.effects  ?? [];
  const triggers    = relic.triggers ?? [];
  const rarityColor = RELIC_RARITY_COLOR[rarity] ?? "#888";
  const effectById  = new Map(effects.map((e) => [e.id, e]));

  const triggerLines = triggers.map((trg) => ({
    id: trg.id,
    event: trg.event,
    effects: (trg.effectIds ?? []).map((id) => effectById.get(id)).filter(Boolean),
  }));

  const boundIds       = new Set(triggers.flatMap((t) => t.effectIds ?? []));
  const unboundEffects = effects.filter((e) => !boundIds.has(e.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {relic.imageUrl ? (
          <img src={`${API_BASE}/api/assets/file/?path=relics/${relic.imageUrl}`} alt={name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        ) : (
          <div style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a" }} />
        )}
      </div>
      <div style={{
        width: 180, borderRadius: 12, backgroundColor: "#1e1c1b",
        border: `2px solid ${rarityColor}44`, boxShadow: `0 0 16px ${rarityColor}22`,
        padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        boxSizing: "border-box",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e5e5e5", textAlign: "center" }}>{name}</div>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, padding: "2px 6px", borderRadius: 999, backgroundColor: rarityColor + "22", color: rarityColor, border: `1px solid ${rarityColor}44` }}>
          {rarity}
        </span>
        <div style={{ width: "100%", height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />
        {triggerLines.length === 0 && unboundEffects.length === 0 ? (
          <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>No effects.</div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
            {triggerLines.map((trg) => (
              <div key={trg.id} style={{ fontSize: 10, color: "#ddd", textAlign: "center", lineHeight: 1.5 }}>
                <span style={{ color: "#888", fontStyle: "italic" }}>{EVENT_LABELS[trg.event] ?? trg.event}: </span>
                {trg.effects.length === 0 ? (
                  <span style={{ color: "#555" }}>no effects bound.</span>
                ) : (
                  trg.effects.map((eff, i) => (
                    <span key={eff.id}>
                      {relicEffectText(eff, rarityColor)}
                      {i < trg.effects.length - 1 ? "; " : "."}
                    </span>
                  ))
                )}
              </div>
            ))}
            {unboundEffects.map((eff) => (
              <div key={eff.id} style={{ fontSize: 10, color: "#ddd", textAlign: "center", lineHeight: 1.5 }}>
                {relicEffectText(eff, rarityColor)}.
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ──────────────────��─────────────────────────────────────────

export default function CharacterPreview({ character, state }) {
  const [deckOpen, setDeckOpen] = useState(false);
  const name = character.name ?? "Unnamed Character";

  const startingRelic = character.startingRelicId
    ? state.assets.relics.byId[character.startingRelicId]
    : null;

  const startingDeck = (character.startingDeck ?? [])
    .map(({ cardId, count }) => ({ card: state.assets.cards.byId[cardId], count }))
    .filter(({ card }) => card);

  return (
    <>
      {deckOpen && <DeckModal deck={startingDeck} onClose={() => setDeckOpen(false)} />}

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "flex-end", height: "100%",
        gap: 24, paddingBottom: 32, boxSizing: "border-box",
      }}>

        {/* Character image */}
        <div style={{ width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {character.imageUrl ? (
            <img
              src={`${API_BASE}/api/assets/file/?path=playable_characters/${character.imageUrl}`}
              alt={name}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>No image</div>
          )}
        </div>

        {/* Bottom two-column box */}
        <div style={{
          display: "flex",
          borderRadius: 14,
          backgroundColor: "#1e1c1b",
          border: "2px solid rgba(255,255,255,0.08)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>

          {/* Left: Starting Relic */}
          <div style={{
            borderRight: "1px solid rgba(255,255,255,0.07)",
            padding: "16px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
              Starting Relic
            </div>
            <RelicDisplay relic={startingRelic} />
          </div>

          {/* Right: Starting Deck */}
          <div style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
                Starting Deck
              </div>
              {startingDeck.length > 0 && (
                <button
                  onClick={() => setDeckOpen(true)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 6, color: "#aaa",
                    fontSize: 11, padding: "2px 8px", cursor: "pointer",
                  }}
                >
                  View Cards
                </button>
              )}
            </div>

            {startingDeck.length === 0 ? (
              <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>No cards in deck.</div>
            ) : (
              startingDeck.map(({ card, count }, i) => (
                <div key={card.id ?? i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "4px 0",
                  borderBottom: i < startingDeck.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                  <div style={{ width: 32, height: 45, flexShrink: 0, borderRadius: 4, overflow: "hidden", backgroundColor: "#0a0a0a" }}>
                    {card.imageUrl ? (
                      <img src={`${API_BASE}/api/assets/file/?path=cards/${card.imageUrl}`} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#1a1a1a" }} />
                    )}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: "#ddd" }}>{card.name ?? "Unnamed Card"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 999, padding: "1px 8px" }}>
                    ×{count}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}
