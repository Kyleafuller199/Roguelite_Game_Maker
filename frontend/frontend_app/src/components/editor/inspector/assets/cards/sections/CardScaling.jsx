/**
 * CardScalingSection.jsx
 * Scaling rules that modify a specific effect based on combat/game events.
 * V1: stores rules as selected.scaling[].
 */
import { useMemo } from "react";
import Label from "../../../shared/Label";
import clampNumber from "../../../shared/clampNumber";

const SCALING_TRIGGERS = [
  "timesPlayedThisCombat",
  "cardsPlayedThisTurn",
  "cardsInHand",
  "turnsElapsed",
  "energySpentThisTurn",
  "missingHp",
];

const OPERATIONS = ["add"]; // keep V1 simple (add only)

function makeId(prefix = "scale") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function CardScalingSection({ selected, update }) {
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);
  const scaling = useMemo(() => selected.scaling ?? [], [selected.scaling]);

  function setScaling(next) {
    update({ scaling: next });
  }

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
        cap: null,
      },
    ]);
  }

  function removeRule(id) {
    setScaling(scaling.filter((r) => r.id !== id));
  }

  function patchRule(id, patch) {
    setScaling(scaling.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Scaling</div>
        <button
          onClick={addRule}
          disabled={effects.length === 0}
          style={{ padding: "6px 10px", cursor: effects.length ? "pointer" : "not-allowed" }}
        >
          + Add Scaling
        </button>
      </div>

      {effects.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
          Add an effect first to enable scaling.
        </div>
      ) : scaling.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
          No scaling rules yet.
        </div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
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

              <Label>Applies To Effect</Label>
              <select
                value={rule.appliesToEffectId ?? ""}
                onChange={(e) => patchRule(rule.id, { appliesToEffectId: e.target.value })}
                style={{ width: "100%", padding: 10, marginBottom: 12 }}
              >
                {effects.map((eff) => (
                  <option key={eff.id} value={eff.id}>
                    {eff.effectType} (base {eff.baseValue ?? 0})
                  </option>
                ))}
              </select>

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

              <Label>Amount per Unit</Label>
              <input
                type="number"
                value={rule.amountPerUnit ?? 1}
                onChange={(e) =>
                  patchRule(rule.id, { amountPerUnit: clampNumber(e.target.value, -999, 999) })
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