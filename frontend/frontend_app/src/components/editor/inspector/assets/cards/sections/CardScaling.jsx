/**
 * CardScaling.jsx
 *
 * Card scaling section.
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";
import clampNumber from "../../../shared/clampNumber";
import { makeId } from "@/utils/makeId";

const SCALING_TRIGGERS = [
  "timesPlayedThisCombat", "cardsPlayedThisTurn", "cardsInHand",
  "turnsElapsed", "energySpentThisTurn", "missingHp",
];
const OPERATIONS = ["add"];

const actionBtnStyle = {
  padding: "2px 8px", fontSize: 12,
  background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4, color: "#e5e5e5",
};

export default function CardScalingSection({ selected, update }) {
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);
  const scaling = useMemo(() => selected.scaling ?? [], [selected.scaling]);

  function setScaling(next) { update({ scaling: next }); }
  function addRule() {
    if (effects.length === 0) return;
    setScaling([...scaling, { id: makeId("scale"), appliesToEffectId: effects[0]?.id ?? null, basedOn: "timesPlayedThisCombat", operation: "add", amountPerUnit: 1, cap: null }]);
  }
  function removeRule(id) { setScaling(scaling.filter((r) => r.id !== id)); }
  function patchRule(id, patch) { setScaling(scaling.map((r) => r.id === id ? { ...r, ...patch } : r)); }

  return (
    <InspectorSection
      title="Scaling"
      action={
        <button onClick={addRule} disabled={effects.length === 0}
          style={{ ...actionBtnStyle, cursor: effects.length ? "pointer" : "not-allowed" }}>
          + Add Scaling
        </button>
      }
    >
      {effects.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 14 }}>Add an effect first to enable scaling.</div>
      ) : scaling.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 14 }}>No scaling rules yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {scaling.map((rule) => (
            <div key={rule.id} style={{ padding: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 600 }}>Scaling Rule</div>
                <button onClick={() => removeRule(rule.id)} style={{ ...actionBtnStyle, cursor: "pointer" }}>Remove</button>
              </div>

              <Label>Applies To Effect</Label>
              <select value={rule.appliesToEffectId ?? ""} onChange={(e) => patchRule(rule.id, { appliesToEffectId: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
                {effects.map((eff) => <option key={eff.id} value={eff.id}>{eff.effectType} (base {eff.baseValue ?? 0})</option>)}
              </select>

              <Label>Based On</Label>
              <select value={rule.basedOn} onChange={(e) => patchRule(rule.id, { basedOn: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
                {SCALING_TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>

              <Label>Operation</Label>
              <select value={rule.operation} onChange={(e) => patchRule(rule.id, { operation: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
                {OPERATIONS.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>

              <Label>Amount per Unit</Label>
              <input type="number" value={rule.amountPerUnit ?? 1}
                onChange={(e) => patchRule(rule.id, { amountPerUnit: clampNumber(e.target.value, -999, 999) })}
                style={{ width: "100%", padding: 10, marginBottom: 12 }} />
            </div>
          ))}
        </div>
      )}
    </InspectorSection>
  );
}
