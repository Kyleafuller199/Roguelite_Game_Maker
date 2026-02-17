/**
 * EnemyMoves.jsx
 *
 * Inspector section responsible for editing `enemy.moves`.
 *
 * V1 Storage:
 * - Stores moves directly on the enemy object as `selected.moves[]`.
 * - Each move contains an `effects[]` list that defines what the move does.
 *
 * JSON Shape Controlled Here:
 * enemy.moves = [
 *   {
 *     id: string,
 *     name: string,
 *     effects: [
 *       {
 *         id: string,
 *         effectType: string,        // keys from EFFECT_CONFIG
 *         baseValue: number,
 *         target?: string,           // only when required by type
 *         repeat?: number            // only when supported by type
 *       }
 *     ]
 *   }
 * ]
 *
 * Design Notes:
 * - Behavior ordering references moves by id (see EnemyBehavior). When a move is added/removed,
 *   this section also updates `enemy.behavior.cycleOrder` to keep references consistent.
 * - normalizeEffectForType ensures effect objects stay valid when switching effectType
 *   (adds/removes fields based on config and applies defaults).
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

/**
 * EFFECT_CONFIG
 * Defines which fields are relevant for each effect type.
 * This drives conditional UI and normalization rules.
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
 * Target options for enemy move effects.
 * (Used only when the effect type requires a target.)
 */
const ENEMY_TARGETS = [
  { value: "player", label: "Player" },
  { value: "self", label: "Self" },
  { value: "selectedEnemy", label: "Selected Enemy" },
  { value: "randomEnemy", label: "Random Enemy" },
  { value: "allEnemies", label: "All Enemies" },
];

/**
 * makeId
 * Simple ID generator for V1 UI-created items.
 * (Not stable across sessions; persistence layer will replace this.)
 */
function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * normalizeEffectForType
 *
 * When an effect changes type, some fields may become irrelevant (target/repeat),
 * and some may become required. This function:
 * - sets effectType
 * - removes fields not supported by the new type
 * - applies defaults for required fields
 */
function normalizeEffectForType(effect, nextType) {
  const cfg = EFFECT_CONFIG[nextType] ?? EFFECT_CONFIG.damage;
  const next = { ...effect, effectType: nextType };

  // Remove fields that the new type does not use
  if (!cfg.requiresTarget) delete next.target;
  if (!cfg.supportsRepeat) delete next.repeat;

  // Add defaults for required fields
  if (cfg.requiresTarget && !next.target) next.target = "player";
  if (cfg.supportsRepeat && (!next.repeat || next.repeat < 1)) next.repeat = 1;

  // Ensure numeric value exists
  if (next.baseValue == null) next.baseValue = 1;

  return next;
}

export default function EnemyMoves({ selected, update }) {
  /**
   * Read-only view of current moves.
   * useMemo prevents re-allocating on unrelated renders.
   */
  const moves = useMemo(() => selected.moves ?? [], [selected.moves]);

  /**
   * setMoves
   * Replaces the entire moves array (immutable updates).
   */
  function setMoves(next) {
    update({ moves: next });
  }

  /**
   * addMove
   * Prepends a new move and updates behavior.cycleOrder if behaviorType is cycle.
   * This keeps the behavior order valid without requiring the user to manually add it.
   */
  function addMove() {
    const id = makeId("move");
    const next = [{ id, name: "New Move", effects: [] }, ...moves];

    // Keep behavior order consistent with moves (cycle only)
    const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };
    const cycleOrder = behavior.cycleOrder ?? [];
    const nextBehavior =
      (behavior.behaviorType ?? "cycle") === "cycle"
        ? { ...behavior, cycleOrder: [...cycleOrder, id] }
        : behavior;

    update({ moves: next, behavior: nextBehavior });
  }

  /**
   * removeMove
   * Removes a move and also removes all references to its id in behavior.cycleOrder.
   */
  function removeMove(moveId) {
    const nextMoves = moves.filter((m) => m.id !== moveId);

    const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };
    const nextOrder = (behavior.cycleOrder ?? []).filter((id) => id !== moveId);
    const nextBehavior = { ...behavior, cycleOrder: nextOrder };

    update({ moves: nextMoves, behavior: nextBehavior });
  }

  /**
   * patchMove
   * Applies a shallow patch to a move by id.
   */
  function patchMove(moveId, patch) {
    setMoves(moves.map((m) => (m.id === moveId ? { ...m, ...patch } : m)));
  }

  /**
   * setMoveEffects
   * Replaces a move's effects list.
   */
  function setMoveEffects(moveId, nextEffects) {
    patchMove(moveId, { effects: nextEffects });
  }

  /**
   * addEffect
   * Adds a default "damage" effect to the specified move.
   */
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

  /**
   * removeEffect
   * Removes an effect from a move by effect id.
   */
  function removeEffect(moveId, effectId) {
    const move = moves.find((m) => m.id === moveId);
    const effects = move?.effects ?? [];
    setMoveEffects(
      moveId,
      effects.filter((e) => e.id !== effectId)
    );
  }

  /**
   * patchEffect
   * Applies a shallow patch to one effect object inside a move.
   */
  function patchEffect(moveId, effectId, patch) {
    const move = moves.find((m) => m.id === moveId);
    const effects = move?.effects ?? [];
    setMoveEffects(
      moveId,
      effects.map((e) => (e.id === effectId ? { ...e, ...patch } : e))
    );
  }

  /**
   * setEffectType
   * Changes effectType and normalizes the effect object to match the new type.
   */
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
      {/* Section header + primary action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Moves</div>
        <button onClick={addMove} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Move
        </button>
      </div>

      {/* Empty state */}
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
              {/* Move header row */}
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
                {/* Move name */}
                <Label>Name</Label>
                <input
                  value={move.name ?? ""}
                  onChange={(e) => patchMove(move.id, { name: e.target.value })}
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                />

                {/* Effects header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Effects</div>
                  <button
                    onClick={() => addEffect(move.id)}
                    style={{ padding: "6px 10px", cursor: "pointer" }}
                  >
                    + Add Effect
                  </button>
                </div>

                {/* Empty state for effects */}
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
                            border: "1px solid rgba(0,0,0,0.10)",
                            borderRadius: 8,
                          }}
                        >
                          {/* Effect header row */}
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ fontWeight: 700, marginBottom: 10 }}>Effect</div>
                            <button
                              onClick={() => removeEffect(move.id, eff.id)}
                              style={{ cursor: "pointer", padding: "4px 8px" }}
                            >
                              Remove
                            </button>
                          </div>

                          {/* Effect type */}
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

                          {/* Base value (numeric) */}
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

                          {/* Target (conditional by effect type) */}
                          {cfg.requiresTarget && (
                            <>
                              <Label>Target</Label>
                              <select
                                value={eff.target ?? "player"}
                                onChange={(e) =>
                                  patchEffect(move.id, eff.id, { target: e.target.value })
                                }
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

                          {/* Repeat (conditional by effect type) */}
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