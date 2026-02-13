/**
 * RelicEffects.jsx
 * Effect section: list editor for relic effects.
 * V1: stores effects as selected.effects[].
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

function makeId(prefix = "eff") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeEffectForType(effect, nextType) {
  const cfg = EFFECT_CONFIG[nextType];
  const next = { ...effect, effectType: nextType };

  if (!cfg.requiresTarget) delete next.target;
  if (!cfg.supportsRepeat) delete next.repeat;

  if (cfg.requiresTarget && !next.target) next.target = "selectedEnemy";
  if (cfg.supportsRepeat && (!next.repeat || next.repeat < 1)) next.repeat = 1;

  if (next.baseValue == null) next.baseValue = 1;

  return next;
}

export default function RelicEffects({ selected, update }) {
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);

  function setEffects(next) {
    update({ effects: next });
  }

  function addEffect() {
    const newEffect = normalizeEffectForType(
      {
        id: makeId(),
        effectType: "gainEnergy",
        baseValue: 1,
        target: "self",
        repeat: 1,
      },
      "gainEnergy"
    );

    setEffects([...effects, newEffect]);
  }

  function removeEffect(id) {
    setEffects(effects.filter((e) => e.id !== id));
  }

  function patchEffect(id, patch) {
    setEffects(effects.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function setEffectType(id, nextType) {
    setEffects(effects.map((e) => (e.id === id ? normalizeEffectForType(e, nextType) : e)));
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Effects</div>
        <button onClick={addEffect} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Effect
        </button>
      </div>

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
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                  <button
                    onClick={() => removeEffect(eff.id)}
                    style={{ cursor: "pointer", padding: "4px 8px" }}
                  >
                    Remove
                  </button>
                </div>

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

                <Label>Base Value</Label>
                <input
                  type="number"
                  value={eff.baseValue ?? 0}
                  onChange={(e) =>
                    patchEffect(eff.id, { baseValue: clampNumber(e.target.value, 0, 999) })
                  }
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                />

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

                {cfg.supportsRepeat && (
                  <>
                    <Label>Times Repeated</Label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={eff.repeat ?? 1}
                      onChange={(e) => patchEffect(eff.id, { repeat: clampNumber(e.target.value, 1, 99) })}
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