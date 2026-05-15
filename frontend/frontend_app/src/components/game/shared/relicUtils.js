// Shared relic utility — used by TreasureScreen and the relic bar in Play.jsx

const TRIGGER_LABELS = {
  startOfCombat: "Start of combat",
  startOfTurn:   "Start of turn",
  endOfTurn:     "End of turn",
  endOfCombat:   "End of combat",
  cardPlayed:    "On card played",
  cardDrawn:     "On card drawn",
  damageTaken:   "On damage taken",
};

function formatEffect(eff) {
  const v = eff.baseValue ?? 0;
  switch (eff.effectType) {
    case "heal":       return `Heal ${v} HP`;
    case "damage":     return `Deal ${v} damage`;
    case "block":      return `Gain ${v} Block`;
    case "gainEnergy": return `Gain ${v} Energy`;
    case "draw":       return `Draw ${v} card${v !== 1 ? "s" : ""}`;
    case "strength":   return `Gain ${v} Strength`;
    default:           return `${eff.effectType} ${v}`;
  }
}

export function relicEffectLines(relic) {
  const effects    = relic.effects  ?? [];
  const triggers   = relic.triggers ?? [];
  const effectById = Object.fromEntries(effects.map(e => [e.id, e]));

  return triggers.map(trigger => {
    const label = TRIGGER_LABELS[trigger.event] ?? trigger.event;
    const descs = (trigger.effectIds ?? [])
      .map(id => effectById[id])
      .filter(Boolean)
      .map(formatEffect);
    return `${label}: ${descs.join(", ")}`;
  });
}
