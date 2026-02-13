/**
 * EnemyMoves.jsx
 * Move section: list editor for enemy moves.
 * Each move has: id, name, effects[]
 * V1: stores moves as selected.moves[].
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

const ENEMY_TARGETS = [
  { value: "player", label: "Player" },
  { value: "self", label: "Self" },
  { value: "selectedEnemy", label: "Selected Enemy" },
  { value: "randomEnemy", label: "Random Enemy" },
  { value: "allEnemies", label: "All Enemies" },
];

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
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

export default function EnemyMoves({ selected, update }) {
  const moves = useMemo(() => selected.moves ?? [], [selected.moves]);

  function setMoves(next) {
    update({ moves: next });
  }

  function addMove() {
    const id = makeId("move");
    const next = [{ id, name: "New Move", effects: [] }, ...moves];

    // If behavior is a cycle and has no order yet, initialize order with this move.
    const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };
    const cycleOrder = behavior.cycleOrder ?? [];
    const nextBehavior =
      (behavior.behaviorType ?? "cycle") === "cycle"
        ? { ...behavior, cycleOrder: [...cycleOrder, id] }
        : behavior;

    update({ moves: next, behavior: nextBehavior });
  }

  function removeMove(moveId) {
    const nextMoves = moves.filter((m) => m.id !== moveId);

    // Remove move from behavior order too
    const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };
    const nextOrder = (behavior.cycleOrder ?? []).filter((id) => id !== moveId);
    const nextBehavior = { ...behavior, cycleOrder: nextOrder };

    update({ moves: nextMoves, behavior: nextBehavior });
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
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Moves</div>
        <button onClick={addMove} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Move
        </button>
      </div>

      {moves.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>No moves yet.</div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {moves.map((move) => (
            <div
              key={move.id}
              style={{
                padding: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 700 }}>Move</div>
                <button
                  onClick={() => removeMove(move.id)}
                  style={{ cursor: "pointer", padding: "4px 8px" }}
                >
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effects</div>
                  <button
                    onClick={() => addEffect(move.id)}
                    style={{ padding: "6px 10px", cursor: "pointer" }}
                  >
                    + Add Effect
                  </button>
                </div>

                {(move.effects ?? []).length === 0 ? (
                  <div style={{ marginTop: 6, opacity: 0.7, fontSize: 14 }}>No effects on this move.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {(move.effects ?? []).map((eff) => {
                      const cfg = EFFECT_CONFIG[eff.effectType] ?? EFFECT_CONFIG.damage;

                      return (
                        <div
                          key={eff.id}
                          style={{
                            padding: 12,
                            border: "1px solid rgba(0,0,0,0.10)",
                            borderRadius: 8,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                            <button
                              onClick={() => removeEffect(move.id, eff.id)}
                              style={{ cursor: "pointer", padding: "4px 8px" }}
                            >
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
    </div>
  );
}