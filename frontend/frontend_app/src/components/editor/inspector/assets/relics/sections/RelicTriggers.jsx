/**
 * RelicTriggers.jsx
 * Trigger section: choose event + bind effects by id.
 * V1: stores triggers as selected.triggers[] with trigger.effectIds[].
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";

const RELIC_EVENTS = [
  "startOfCombat",
  "startOfTurn",
  "endOfTurn",
  "endOfCombat",
  "cardPlayed",
  "cardDrawn",
  "damageTaken",
];

function makeId(prefix = "trg") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function effectSummary(eff) {
  const type = eff.effectType ?? "effect";
  const val = eff.baseValue ?? 0;
  const tgt = eff.target ? ` • ${eff.target}` : "";
  const rep = eff.repeat && eff.repeat > 1 ? ` x${eff.repeat}` : "";
  return `${type} ${val}${rep}${tgt}`;
}

export default function RelicTriggers({ selected, update }) {
  const triggers = useMemo(() => selected.triggers ?? [], [selected.triggers]);
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);

  function setTriggers(next) {
    update({ triggers: next });
  }

  function addTrigger() {
    const trg = { id: makeId(), event: "startOfTurn", effectIds: [] };
    setTriggers([trg, ...triggers]);
  }

  function removeTrigger(id) {
    setTriggers(triggers.filter((t) => t.id !== id));
  }

  function patchTrigger(id, patch) {
    setTriggers(triggers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function toggleEffect(triggerId, effectId) {
    const trg = triggers.find((t) => t.id === triggerId);
    const currentIds = trg?.effectIds ?? [];

    const nextIds = currentIds.includes(effectId)
      ? currentIds.filter((x) => x !== effectId)
      : [...currentIds, effectId];

    patchTrigger(triggerId, { effectIds: nextIds });
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Triggers</div>
        <button onClick={addTrigger} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Trigger
        </button>
      </div>

      {triggers.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>No triggers yet.</div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {triggers.map((trg) => (
            <div
              key={trg.id}
              style={{
                padding: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 700 }}>Trigger</div>
                <button
                  onClick={() => removeTrigger(trg.id)}
                  style={{ cursor: "pointer", padding: "4px 8px" }}
                >
                  Remove
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <Label>Event</Label>
                <select
                  value={trg.event ?? "startOfTurn"}
                  onChange={(e) => patchTrigger(trg.id, { event: e.target.value })}
                  style={{ width: "100%", padding: 10, marginBottom: 12 }}
                >
                  {RELIC_EVENTS.map((ev) => (
                    <option key={ev} value={ev}>
                      {ev}
                    </option>
                  ))}
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
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEffect(trg.id, eff.id)}
                          />
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
    </div>
  );
}