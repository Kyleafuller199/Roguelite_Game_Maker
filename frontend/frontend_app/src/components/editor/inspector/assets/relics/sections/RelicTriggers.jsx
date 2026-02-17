/**
 * RelicTriggers.jsx
 *
 * Inspector section responsible for editing `relic.triggers`.
 *
 * Purpose:
 * - Defines WHEN a relic activates (event)
 * - Defines WHICH relic effects fire on that event (effectIds)
 *
 * V1 Storage:
 * - Stores triggers directly on the relic as `selected.triggers[]`
 * - Each trigger stores references to effects by id: `trigger.effectIds[]`
 *
 * JSON Shape Controlled Here:
 * relic.triggers = [
 *   {
 *     id: string,
 *     event: string,        // one of RELIC_EVENTS
 *     effectIds: string[]   // references to relic.effects[*].id
 *   }
 * ]
 *
 * Design Notes:
 * - Triggers reference effects by id (not by object) to keep data normalized.
 * - This file uses browser `crypto.randomUUID()` for stable ids (no Node import).
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";

/**
 * RELIC_EVENTS
 * Supported trigger events for V1.
 * (Can later be expanded or replaced with a shared enum/constants module.)
 */
const RELIC_EVENTS = [
  "startOfCombat",
  "startOfTurn",
  "endOfTurn",
  "endOfCombat",
  "cardPlayed",
  "cardDrawn",
  "damageTaken",
];

/**
 * makeId
 * Frontend-friendly UUID generator for newly created triggers.
 * Uses the browser Web Crypto API (no import required).
 */
function makeId(prefix = "trigger") {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * effectSummary
 * Small UI helper to render a readable one-line summary of an effect.
 */
function effectSummary(eff) {
  const type = eff.effectType ?? "effect";
  const val = eff.baseValue ?? 0;
  const tgt = eff.target ? ` • ${eff.target}` : "";
  const rep = eff.repeat && eff.repeat > 1 ? ` x${eff.repeat}` : "";
  return `${type} ${val}${rep}${tgt}`;
}

export default function RelicTriggers({ selected, update }) {
  /**
   * Read triggers and effects from the selected relic.
   * useMemo avoids re-allocating arrays on unrelated renders.
   */
  const triggers = useMemo(() => selected.triggers ?? [], [selected.triggers]);
  const effects = useMemo(() => selected.effects ?? [], [selected.effects]);

  /**
   * setTriggers
   * Replaces the entire triggers array (immutable update).
   */
  function setTriggers(next) {
    update({ triggers: next });
  }

  /**
   * addTrigger
   * Adds a new trigger with a default event and no attached effects.
   */
  function addTrigger() {
    const trg = {
      id: makeId("trg"),
      event: "startOfTurn",
      effectIds: [],
    };
    setTriggers([trg, ...triggers]);
  }

  /**
   * removeTrigger
   * Removes a trigger by id.
   */
  function removeTrigger(id) {
    setTriggers(triggers.filter((t) => t.id !== id));
  }

  /**
   * patchTrigger
   * Applies a shallow patch to a trigger by id.
   */
  function patchTrigger(id, patch) {
    setTriggers(triggers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  /**
   * toggleEffect
   * Adds or removes an effect id from a trigger's effectIds list.
   * This allows multiple effects to be attached to a single trigger.
   */
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
      {/* Section header + primary action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Triggers</div>
        <button onClick={addTrigger} style={{ padding: "6px 10px", cursor: "pointer" }}>
          + Add Trigger
        </button>
      </div>

      {/* Empty state */}
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
              {/* Trigger header row */}
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
                {/* Event selector */}
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

                {/* Effects binding */}
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