/**
 * RelicEffects.jsx
 *
 * Inspector section for relic.effects[].
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";
import clampNumber from "../../../shared/clampNumber";
import { makeId } from "@/utils/makeId";

const EFFECT_CONFIG = {
  damage:     { label: "Damage",      requiresTarget: true,  supportsRepeat: true },
  block:      { label: "Block",       requiresTarget: true,  supportsRepeat: true },
  heal:       { label: "Heal",        requiresTarget: true,  supportsRepeat: true },
  draw:       { label: "Draw",        requiresTarget: false, supportsRepeat: true },
  gainEnergy: { label: "Gain Energy", requiresTarget: false, supportsRepeat: true },
  weak:        { label: "Weak",        requiresTarget: true,  supportsRepeat: true },
  vulnerable:  { label: "Vulnerable",  requiresTarget: true,  supportsRepeat: true },
  frail:       { label: "Frail",       requiresTarget: true,  supportsRepeat: true },
  strength:    { label: "Strength",    requiresTarget: true,  supportsRepeat: true },
  dexterity:   { label: "Dexterity",   requiresTarget: true,  supportsRepeat: true },
};

const EFFECT_TYPES = Object.keys(EFFECT_CONFIG);

function normalizeEffectForType(effect, nextType) {
  const cfg = EFFECT_CONFIG[nextType] ?? EFFECT_CONFIG.damage;
  const next = { ...effect, effectType: nextType };
  if (!cfg.requiresTarget) delete next.target;
  if (!cfg.supportsRepeat) delete next.repeat;
  if (cfg.requiresTarget && !next.target) next.target = "selectedEnemy";
  if (cfg.supportsRepeat && (!next.repeat || next.repeat < 1)) next.repeat = 1;
  if (next.baseValue == null) next.baseValue = 1;
  return next;
}

const actionBtnStyle = {
  padding: "2px 8px", fontSize: 12, cursor: "pointer",
  background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4, color: "#e5e5e5",
};

export default function RelicEffects({ selected, update }) {
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);

  function setEffects(next) { update({ effects: next }); }
  function addEffect() {
    setEffects([...effects, normalizeEffectForType(
      { id: makeId("eff"), effectType: "gainEnergy", baseValue: 1, target: "self", repeat: 1 },
      "gainEnergy"
    )]);
  }
  function removeEffect(id) { setEffects(effects.filter((e) => e.id !== id)); }
  function patchEffect(id, patch) { setEffects(effects.map((e) => e.id === id ? { ...e, ...patch } : e)); }
  function setEffectType(id, nextType) { setEffects(effects.map((e) => e.id === id ? normalizeEffectForType(e, nextType) : e)); }

  return (
    <InspectorSection
      title="Effects"
      action={<button onClick={addEffect} style={actionBtnStyle}>+ Add Effect</button>}
    >
      {effects.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 14 }}>No effects yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {effects.map((eff) => {
            const cfg = EFFECT_CONFIG[eff.effectType] ?? EFFECT_CONFIG.damage;
            return (
              <div key={eff.id} style={{ padding: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                  <button onClick={() => removeEffect(eff.id)} style={actionBtnStyle}>Remove</button>
                </div>

                <Label>Type</Label>
                <select value={eff.effectType} onChange={(e) => setEffectType(eff.id, e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
                  {EFFECT_TYPES.map((t) => <option key={t} value={t}>{EFFECT_CONFIG[t].label}</option>)}
                </select>

                <Label>Base Value</Label>
                <input type="number" value={eff.baseValue ?? 0}
                  onChange={(e) => patchEffect(eff.id, { baseValue: clampNumber(e.target.value, 0, 999) })}
                  style={{ width: "100%", padding: 10, marginBottom: 12 }} />

                {cfg.requiresTarget && (
                  <>
                    <Label>Target</Label>
                    <select value={eff.target ?? "selectedEnemy"} onChange={(e) => patchEffect(eff.id, { target: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
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
                    <input type="number" min={1} max={99} value={eff.repeat ?? 1}
                      onChange={(e) => patchEffect(eff.id, { repeat: clampNumber(e.target.value, 1, 99) })}
                      style={{ width: "100%", padding: 10 }} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </InspectorSection>
  );
}
