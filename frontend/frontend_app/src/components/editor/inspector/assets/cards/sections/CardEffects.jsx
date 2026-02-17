/**
 * CardEffects.jsx
 *
 * Card effects section.
 *
 * Responsibilities:
 * - Edits the list of effects attached to a card (selected.effects[])
 * - Supports adding/removing effects
 * - Supports changing effect type and normalizing fields based on type
 *
 * Data model (V1):
 * - Effects are stored on the card as: selected.effects: Array<Effect>
 * - Each effect is an object with:
 *   - id: string
 *   - effectType: string
 *   - baseValue: number
 *   - target?: string (only for types that require a target)
 *   - repeat?: number (only for types that support repetition)
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

/**
 * EFFECT_CONFIG controls which fields appear for each effect type and how it is labeled.
 * This keeps UI logic declarative and prevents scattered conditionals.
 */
const EFFECT_CONFIG = {
  damage: { label: "Damage", requiresTarget: true, supportsRepeat: true },
  block: { label: "Block", requiresTarget: true, supportsRepeat: true },
  heal: { label: "Heal", requiresTarget: true, supportsRepeat: true },
  draw: { label: "Draw", requiresTarget: false, supportsRepeat: true },
  gainEnergy: { label: "Gain Energy", requiresTarget: false, supportsRepeat: true },

  weak: { label: "Weak", requiresTarget: true, supportsRepeat: true },
  vulnerable: { label: "Vulnerable", requiresTarget: true, supportsRepeat: true },
  frail: { label: "Frail", requiresTarget: true, supportsRepeat: true },
  strength: { label: "Strength", requiresTarget: true, supportsRepeat: true },
  dexterity: { label: "Dexterity", requiresTarget: true, supportsRepeat: true },
};

const EFFECT_TYPES = Object.keys(EFFECT_CONFIG);

/**
 * makeId
 *
 * Generates a lightweight unique id for new effects.
 * Good enough for client-only creation; backend can replace with persistent ids later.
 */
function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * normalizeEffectForType
 *
 * Ensures an effect object contains only the fields relevant to a given effect type.
 * This prevents stale fields (e.g., target) from lingering when switching types.
 *
 * @param {object} effect - Existing effect object
 * @param {string} nextType - New effect type to normalize to
 * @returns {object} Normalized effect object
 */
function normalizeEffectForType(effect, nextType) {
  const cfg = EFFECT_CONFIG[nextType];
  const next = { ...effect, effectType: nextType };

  // Remove fields that no longer apply to the new type.
  if (!cfg.requiresTarget) delete next.target;
  if (!cfg.supportsRepeat) delete next.repeat;

  // Ensure required defaults exist when needed.
  if (cfg.requiresTarget && !next.target) next.target = "selectedEnemy";
  if (cfg.supportsRepeat && (!next.repeat || next.repeat < 1)) next.repeat = 1;

  // baseValue always applies in V1.
  if (next.baseValue == null) next.baseValue = 1;

  return next;
}

/**
 * CardEffects
 *
 * @param {object} selected - Currently selected card
 * @param {Function} update - Update handler (partial patch function)
 */
export default function CardEffects({ selected, update }) {
  /**
   * Memoize effects list so list operations don't recreate a new array reference
   * unless the underlying selected.effects changes.
   */
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);

  /**
   * setEffects
   *
   * Convenience wrapper to patch the card's effects array.
   * The `update` function is expected to merge this partial update.
   */
  function setEffects(next) {
    update({ effects: next });
  }

  /**
   * addEffect
   *
   * Adds a new default "damage" effect to the end of the list.
   */
  function addEffect() {
    const newEffect = normalizeEffectForType(
      {
        id: makeId(),
        effectType: "damage",
        baseValue: 6,
        target: "selectedEnemy",
        repeat: 1,
      },
      "damage"
    );

    setEffects([...effects, newEffect]);
  }

  /**
   * removeEffect
   *
   * Removes an effect by id.
   */
  function removeEffect(id) {
    setEffects(effects.filter((e) => e.id !== id));
  }

  /**
   * patchEffect
   *
   * Applies a partial update to a single effect by id.
   */
  function patchEffect(id, patch) {
    setEffects(effects.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  /**
   * setEffectType
   *
   * Updates the effect type and normalizes fields to match the new type.
   */
  function setEffectType(id, nextType) {
    setEffects(
      effects.map((e) => (e.id === id ? normalizeEffectForType(e, nextType) : e))
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Section header + primary action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700 }}>Effects</div>
        <button onClick={addEffect} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Effect
        </button>
      </div>

      {/* Empty state */}
      {effects.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
          No effects yet.
        </div>
      ) : (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {effects.map((eff) => {
            const cfg = EFFECT_CONFIG[eff.effectType] ?? EFFECT_CONFIG.damage;

            return (
              <div
                key={eff.id}
                style={{
                  padding: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                  <button
                    onClick={() => removeEffect(eff.id)}
                    style={{ cursor: "pointer", padding: "4px 8px" }}
                  >
                    Remove
                  </button>
                </div>

                {/* Effect Type */}
                <Label>Type</Label>
                <select
                  value={eff.effectType}
                  onChange={(e) => setEffectType(eff.id, e.target.value)}
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                >
                  {EFFECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {EFFECT_CONFIG[t].label}
                    </option>
                  ))}
                </select>

                {/* Base Value */}
                <Label>Base Value</Label>
                <input
                  type="number"
                  value={eff.baseValue ?? 0}
                  onChange={(e) =>
                    patchEffect(eff.id, {
                      baseValue: clampNumber(e.target.value, 0, 999),
                    })
                  }
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                />

                {/* Target (only when required) */}
                {cfg.requiresTarget && (
                  <>
                    <Label>Target</Label>
                    <select
                      value={eff.target ?? "selectedEnemy"}
                      onChange={(e) => patchEffect(eff.id, { target: e.target.value })}
                      style={{ width: "100%", padding: 10, marginBottom: 12 }}
                    >
                      <option value="selectedEnemy">Selected Enemy</option>
                      <option value="randomEnemy">Random Enemy</option>
                      <option value="allEnemies">All Enemies</option>
                      <option value="self">Self</option>
                    </select>
                  </>
                )}

                {/* Repeat count (only when supported) */}
                {cfg.supportsRepeat && (
                  <>
                    <Label>Times Repeated</Label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={eff.repeat ?? 1}
                      onChange={(e) =>
                        patchEffect(eff.id, {
                          repeat: clampNumber(e.target.value, 1, 99),
                        })
                      }
                      style={{ width: "100%", padding: 10 }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}