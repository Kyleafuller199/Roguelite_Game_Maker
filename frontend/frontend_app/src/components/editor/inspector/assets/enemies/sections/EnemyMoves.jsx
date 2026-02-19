/**
 * EnemyMoves.jsx
 *
 * Inspector section responsible for editing `enemy.moves`.
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";
import InspectorSection from "../../../shared/InspectorSection";

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

const ENEMY_TARGETS = [
  { value: "player", label: "Player" },
  { value: "self", label: "Self" },
  { value: "selectedEnemy", label: "Selected Enemy" },
  { value: "randomEnemy", label: "Random Enemy" },
  { value: "allEnemies", label: "All Enemies" },
];

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function normalizeEffectForType(effect, nextType) {
  const cfg = EFFECT_CONFIG[nextType] ?? EFFECT_CONFIG.damage;
  const next = { ...effect, effectType: nextType };

  if (!cfg.requiresTarget) delete next.target;
  if (!cfg.supportsRepeat) delete next.repeat;

  if (cfg.requiresTarget && !next.target) next.target = "player";
  if (cfg.supportsRepeat && (!next.repeat || next.repeat < 1)) next.repeat = 1;

  if (next.baseValue == null) next.baseValue = 1;

  return next;
}

const actionBtnStyle = {
  padding: "2px 8px",
  fontSize: 12,
  cursor: "pointer",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  color: "#e5e5e5",
};

export default function EnemyMoves({ selected, update }) {
  const moves = useMemo(() => selected.moves ?? [], [selected.moves]);
  const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };

  function setMoves(nextMoves) {
    update({ moves: nextMoves });
  }

  function addMove() {
    const id = makeId("move");
    const nextMoves = [{ id, name: "New Move", effects: [] }, ...moves];

    // Keep behavior order consistent with moves (cycle only)
    const cycleOrder = behavior.cycleOrder ?? [];
    if ((behavior.behaviorType ?? "cycle") === "cycle") {
      update({
        moves: nextMoves,
        behavior: { ...behavior, cycleOrder: [...cycleOrder, id] },
      });
      return;
    }

    setMoves(nextMoves);
  }

  function removeMove(moveId) {
    const nextMoves = moves.filter((m) => m.id !== moveId);

    // Remove all references to this moveId in cycleOrder
    const nextOrder = (behavior.cycleOrder ?? []).filter((id) => id !== moveId);
    update({
      moves: nextMoves,
      behavior: { ...behavior, cycleOrder: nextOrder },
    });
  }

  function patchMove(moveId, patch) {
    setMoves(moves.map((m) => (m.id === moveId ? { ...m, ...patch } : m)));
  }

  function setMoveEffects(moveId, nextEffects) {
    patchMove(moveId, { effects: nextEffects });
  }

  function addEffect(moveId) {
    const move = moves.find((m) => m.id === moveId);
    const effects = move?.effects ?? [];

    const eff = normalizeEffectForType(
      {
        id: makeId("eff"),
        effectType: "damage",
        baseValue: 6,
        target: "player",
        repeat: 1,
      },
      "damage"
    );

    setMoveEffects(moveId, [...effects, eff]);
  }

  function removeEffect(moveId, effectId) {
    const move = moves.find((m) => m.id === moveId);
    const effects = move?.effects ?? [];
    setMoveEffects(
      moveId,
      effects.filter((e) => e.id !== effectId)
    );
  }

  function patchEffect(moveId, effectId, patch) {
    const move = moves.find((m) => m.id === moveId);
    const effects = move?.effects ?? [];
    setMoveEffects(
      moveId,
      effects.map((e) => (e.id === effectId ? { ...e, ...patch } : e))
    );
  }

  function setEffectType(moveId, effectId, nextType) {
    const move = moves.find((m) => m.id === moveId);
    const effects = move?.effects ?? [];
    setMoveEffects(
      moveId,
      effects.map((e) => (e.id === effectId ? normalizeEffectForType(e, nextType) : e))
    );
  }

  return (
    <InspectorSection
      title="Moves"
      defaultOpen={false}
      action={
        <button onClick={addMove} style={actionBtnStyle}>
          + Add Move
        </button>
      }
    >
      {moves.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 14 }}>No moves yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {moves.map((move) => (
            <div
              key={move.id}
              style={{
                padding: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 700 }}>Move</div>
                <button onClick={() => removeMove(move.id)} style={actionBtnStyle}>
                  Remove
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <Label>Name</Label>
                <input
                  value={move.name ?? ""}
                  onChange={(e) => patchMove(move.id, { name: e.target.value })}
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effects</div>
                  <button onClick={() => addEffect(move.id)} style={actionBtnStyle}>
                    + Add Effect
                  </button>
                </div>

                {(move.effects ?? []).length === 0 ? (
                  <div style={{ marginTop: 6, opacity: 0.7, fontSize: 14 }}>
                    No effects on this move.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {(move.effects ?? []).map((eff) => {
                      const cfg = EFFECT_CONFIG[eff.effectType] ?? EFFECT_CONFIG.damage;

                      return (
                        <div
                          key={eff.id}
                          style={{
                            padding: 12,
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                            <button onClick={() => removeEffect(move.id, eff.id)} style={actionBtnStyle}>
                              Remove
                            </button>
                          </div>

                          <Label>Type</Label>
                          <select
                            value={eff.effectType}
                            onChange={(e) => setEffectType(move.id, eff.id, e.target.value)}
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
                              patchEffect(move.id, eff.id, {
                                baseValue: clampNumber(e.target.value, 0, 999),
                              })
                            }
                            style={{ width: "100%", padding: 10, marginBottom: 12 }}
                          />

                          {cfg.requiresTarget && (
                            <>
                              <Label>Target</Label>
                              <select
                                value={eff.target ?? "player"}
                                onChange={(e) => patchEffect(move.id, eff.id, { target: e.target.value })}
                                style={{ width: "100%", padding: 10, marginBottom: 12 }}
                              >
                                {ENEMY_TARGETS.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
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
                                onChange={(e) =>
                                  patchEffect(move.id, eff.id, {
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
            </div>
          ))}
        </div>
      )}
    </InspectorSection>
  );
}