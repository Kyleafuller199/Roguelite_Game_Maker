/**
 * CardScalingSection.jsx
 *
 * Card scaling section.
 *
 * Responsibilities:
 * - Edits scaling rules that modify an effect dynamically based on combat/game events
 * - Supports adding/removing scaling rules
 * - Supports binding a scaling rule to a specific effect (by effect id)
 *
 * Data model (V1):
 * - Scaling rules are stored on the card as: selected.scaling: Array<ScalingRule>
 * - Each rule targets an effect via appliesToEffectId and modifies it based on a trigger.
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

/**
 * Supported trigger sources for scaling in V1.
 * These should match the values used in the JSON model / runtime logic.
 */
const SCALING_TRIGGERS = [
  "timesPlayedThisCombat",
  "cardsPlayedThisTurn",
  "cardsInHand",
  "turnsElapsed",
  "energySpentThisTurn",
  "missingHp",
];

/**
 * Supported operations in V1.
 * Keeping this intentionally small prevents premature complexity.
 */
const OPERATIONS = ["add"];

/**
 * makeId
 *
 * Generates a lightweight unique id for new scaling rules.
 * Suitable for client-side editing; backend can replace with persistent ids later.
 */
function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * CardScalingSection
 *
 * @param {object} selected - Currently selected card
 * @param {Function} update - Update handler (partial patch function)
 */
export default function CardScalingSection({ selected, update }) {
  /**
   * Effects are required because scaling rules target a specific effect by id.
   * If there are no effects, scaling is disabled.
   */
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);
  const scaling = useMemo(() => selected.scaling ?? [], [selected.scaling]);

  /**
   * setScaling
   *
   * Convenience wrapper to patch the card's scaling array.
   */
  function setScaling(next) {
    update({ scaling: next });
  }

  /**
   * addRule
   *
   * Adds a default scaling rule. Requires at least one effect so we can bind the rule.
   * Default binding is the first effect.
   */
  function addRule() {
    if (effects.length === 0) return;

    const firstEffectId = effects[0]?.id ?? null;

    setScaling([
      ...scaling,
      {
        id: makeId(),
        appliesToEffectId: firstEffectId,
        basedOn: "timesPlayedThisCombat",
        operation: "add",
        amountPerUnit: 1,
        cap: null, // Placeholder for V2; not yet editable in UI
      },
    ]);
  }

  /**
   * removeRule
   *
   * Removes a scaling rule by id.
   */
  function removeRule(id) {
    setScaling(scaling.filter((r) => r.id !== id));
  }

  /**
   * patchRule
   *
   * Applies a partial update to a single scaling rule by id.
   */
  function patchRule(id, patch) {
    setScaling(scaling.map((r) => (r.id === id ? { ...r, ...patch } : r)));
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
        <div style={{ fontWeight: 700 }}>Scaling</div>
        <button
          onClick={addRule}
          disabled={effects.length === 0}
          style={{
            padding: "6px 10px",
            cursor: effects.length ? "pointer" : "not-allowed",
          }}
        >
          + Add Scaling
        </button>
      </div>

      {/* Empty states */}
      {effects.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
          Add an effect first to enable scaling.
        </div>
      ) : scaling.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
          No scaling rules yet.
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
          {scaling.map((rule) => (
            <div
              key={rule.id}
              style={{
                padding: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 600 }}>Scaling Rule</div>
                <button onClick={() => removeRule(rule.id)} style={{ cursor: "pointer" }}>
                  Remove
                </button>
              </div>

              {/* Effect binding */}
              <Label>Applies To Effect</Label>
              <select
                value={rule.appliesToEffectId ?? ""}
                onChange={(e) =>
                  patchRule(rule.id, { appliesToEffectId: e.target.value })
                }
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              >
                {effects.map((eff) => (
                  <option key={eff.id} value={eff.id}>
                    {eff.effectType} (base {eff.baseValue ?? 0})
                  </option>
                ))}
              </select>

              {/* Trigger */}
              <Label>Based On</Label>
              <select
                value={rule.basedOn}
                onChange={(e) => patchRule(rule.id, { basedOn: e.target.value })}
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              >
                {SCALING_TRIGGERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Operation */}
              <Label>Operation</Label>
              <select
                value={rule.operation}
                onChange={(e) => patchRule(rule.id, { operation: e.target.value })}
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              >
                {OPERATIONS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              {/* Amount */}
              <Label>Amount per Unit</Label>
              <input
                type="number"
                value={rule.amountPerUnit ?? 1}
                onChange={(e) =>
                  patchRule(rule.id, {
                    amountPerUnit: clampNumber(e.target.value, -999, 999),
                  })
                }
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}