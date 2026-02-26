/**
 * RelicTriggers.jsx
 *
 * Inspector section for relic.triggers[].
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";
import InspectorSection from "../../../shared/InspectorSection";
import { makeId } from "@/utils/makeId";

const RELIC_EVENTS = [
  "startOfCombat", "startOfTurn", "endOfTurn", "endOfCombat",
  "cardPlayed", "cardDrawn", "damageTaken",
];

function effectSummary(eff) {
  const type = eff.effectType ?? "effect";
  const val = eff.baseValue ?? 0;
  const tgt = eff.target ? ` • ${eff.target}` : "";
  const rep = eff.repeat && eff.repeat > 1 ? ` x${eff.repeat}` : "";
  return `${type} ${val}${rep}${tgt}`;
}

const actionBtnStyle = {
  padding: "2px 8px", fontSize: 12, cursor: "pointer",
  background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4, color: "#e5e5e5",
};

export default function RelicTriggers({ selected, update }) {
  const triggers = useMemo(() => selected.triggers ?? [], [selected.triggers]);
  const effects  = useMemo(() => selected.effects  ?? [], [selected.effects]);

  function setTriggers(next) { update({ triggers: next }); }
  function addTrigger() { setTriggers([{ id: makeId("trg"), event: "startOfTurn", effectIds: [] }, ...triggers]); }
  function removeTrigger(id) { setTriggers(triggers.filter((t) => t.id !== id)); }
  function patchTrigger(id, patch) { setTriggers(triggers.map((t) => t.id === id ? { ...t, ...patch } : t)); }
  function toggleEffect(triggerId, effectId) {
    const trg = triggers.find((t) => t.id === triggerId);
    const current = trg?.effectIds ?? [];
    patchTrigger(triggerId, {
      effectIds: current.includes(effectId) ? current.filter((x) => x !== effectId) : [...current, effectId],
    });
  }

  return (
    <InspectorSection
      title="Triggers"
      action={<button onClick={addTrigger} style={actionBtnStyle}>+ Add Trigger</button>}
    >
      {triggers.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 14 }}>No triggers yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {triggers.map((trg) => (
            <div key={trg.id} style={{ padding: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 700 }}>Trigger</div>
                <button onClick={() => removeTrigger(trg.id)} style={actionBtnStyle}>Remove</button>
              </div>

              <div style={{ marginTop: 10 }}>
                <Label>Event</Label>
                <select value={trg.event ?? "startOfTurn"} onChange={(e) => patchTrigger(trg.id, { event: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
                  {RELIC_EVENTS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
                </select>

                <Label>Effects</Label>
                {effects.length === 0 ? (
                  <div style={{ marginTop: 8, opacity: 0.7, fontSize: 14 }}>
                    No effects created yet. Add effects above, then attach them here.
                  </div>
                ) : (
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    {effects.map((eff) => {
                      const checked = (trg.effectIds ?? []).includes(eff.id);
                      return (
                        <label key={eff.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input type="checkbox" checked={checked} onChange={() => toggleEffect(trg.id, eff.id)} />
                          <span style={{ fontSize: 14 }}>{effectSummary(eff)}</span>
                        </label>
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
