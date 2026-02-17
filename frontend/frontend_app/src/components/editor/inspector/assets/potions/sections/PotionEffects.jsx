/**
 * PotionEffects.jsx
 *
 * Inspector section responsible for editing `potion.effects`.
 *
 * V1 Storage:
 * - Stores effects directly on the potion object as `selected.effects[]`.
 *
 * JSON Shape Controlled Here:
 * potion.effects = [
 *   {
 *     id: string,
 *     effectType: string,     // keys from EFFECT_CONFIG
 *     baseValue: number,
 *     target?: string,        // only when required by effect type
 *     repeat?: number         // only when supported by effect type
 *   }
 * ]
 *
 * Design Notes:
 * - EFFECT_CONFIG drives both UI (which fields show) and normalization rules.
 * - normalizeEffectForType keeps effect objects valid when switching types
 *   by removing irrelevant fields and applying defaults.
 * - IDs should be stable for persistence; use crypto.randomUUID() in the browser.
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

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
 * Generates a stable UUID for newly created effects (frontend-friendly).
 */
function makeId(prefix = "eff") {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * normalizeEffectForType
 *
 * Ensures an effect object matches the rules for its effectType:
 * - Removes fields not used by the selected type (target/repeat)
 * - Applies defaults for required fields
 */
function normalizeEffectForType(effect, nextType) {
  const cfg = EFFECT_CONFIG[nextType] ?? EFFECT_CONFIG.damage;
  const next = { ...effect, effectType: nextType };

  if (!cfg.requiresTarget) delete next.target;
  if (!cfg.supportsRepeat) delete next.repeat;

  if (cfg.requiresTarget && !next.target) next.target = "self";
  if (cfg.supportsRepeat && (!next.repeat || next.repeat < 1)) next.repeat = 1;

  if (next.baseValue == null) next.baseValue = 1;

  return next;
}

export default function PotionEffects({ selected, update }) {
  // Effects list is owned by the selected potion.
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);

  /**
   * setEffects
   * Replaces the entire effects array (immutable update).
   */
  function setEffects(next) {
    update({ effects: next });
  }

  /**
   * addEffect
   * Potion-friendly default: heal self.
   */
  function addEffect() {
    const newEffect = normalizeEffectForType(
      {
        id: makeId("eff"),
        effectType: "heal",
        baseValue: 12,
        target: "self",
        repeat: 1,
      },
      "heal"
    );

    setEffects([...effects, newEffect]);
  }

  /**
   * removeEffect
   * Removes an effect by id.
   */
  function removeEffect(id) {
    setEffects(effects.filter((e) => e.id !== id));
  }

  /**
   * patchEffect
   * Applies a shallow patch to an effect by id.
   */
  function patchEffect(id, patch) {
    setEffects(effects.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  /**
   * setEffectType
   * Updates effectType and normalizes the effect object to match.
   */
  function setEffectType(id, nextType) {
    setEffects(effects.map((e) => (e.id === id ? normalizeEffectForType(e, nextType) : e)));
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Section header + primary action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Effects</div>
        <button onClick={addEffect} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Effect
        </button>
      </div>

      {/* Empty state */}
      {effects.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>No effects yet.</div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
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
                {/* Effect header row */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                  <button
                    onClick={() => removeEffect(eff.id)}
                    style={{ cursor: "pointer", padding: "4px 8px" }}
                  >
                    Remove
                  </button>
                </div>

                {/* Effect type */}
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

                {/* Base value */}
                <Label>Base Value</Label>
                <input
                  type="number"
                  value={eff.baseValue ?? 0}
                  onChange={(e) =>
                    patchEffect(eff.id, { baseValue: clampNumber(e.target.value, 0, 999) })
                  }
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                />

                {/* Target (conditional) */}
                {cfg.requiresTarget && (
                  <>
                    <Label>Target</Label>
                    <select
                      value={eff.target ?? "self"}
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

                {/* Repeat (conditional) */}
                {cfg.supportsRepeat && (
                  <>
                    <Label>Times Repeated</Label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={eff.repeat ?? 1}
                      onChange={(e) =>
                        patchEffect(eff.id, { repeat: clampNumber(e.target.value, 1, 99) })
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