/**
 * EnemyBehavior.jsx
 * Behavior section: define move order using move ids.
 * V1: cycle behavior with an ordered list (cycleOrder).
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";

const BEHAVIOR_TYPES = [
  { value: "cycle", label: "Cycle" },
  { value: "custom", label: "Custom (same as cycle for now)" },
];

function moveLabel(m) {
  return `${m.name ?? "Unnamed Move"} (${m.id})`;
}

export default function EnemyBehavior({ selected, update }) {
  const moves = useMemo(() => selected.moves ?? [], [selected.moves]);
  const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };
  const cycleOrder = behavior.cycleOrder ?? [];

  function setBehavior(next) {
    update({ behavior: next });
  }

  function setType(nextType) {
    setBehavior({ ...behavior, behaviorType: nextType });
  }

  function addToOrder(moveId) {
    if (!moveId) return;
    setBehavior({ ...behavior, cycleOrder: [...cycleOrder, moveId] });
  }

  function removeFromOrder(index) {
    const next = cycleOrder.filter((_, i) => i !== index);
    setBehavior({ ...behavior, cycleOrder: next });
  }

  function moveUp(index) {
    if (index <= 0) return;
    const next = [...cycleOrder];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setBehavior({ ...behavior, cycleOrder: next });
  }

  function moveDown(index) {
    if (index >= cycleOrder.length - 1) return;
    const next = [...cycleOrder];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    setBehavior({ ...behavior, cycleOrder: next });
  }

  // Only allow ids that exist
  const moveById = new Map(moves.map((m) => [m.id, m]));
  const availableMoves = moves;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Behavior</div>

      <Label>Behavior Type</Label>
      <select
        value={behavior.behaviorType ?? "cycle"}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      >
        {BEHAVIOR_TYPES.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>

      <Label>Cycle Order</Label>
      {availableMoves.length === 0 ? (
        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 14 }}>
          Create moves above, then build the cycle order here.
        </div>
      ) : (
        <>
          <select
            defaultValue=""
            onChange={(e) => {
              addToOrder(e.target.value);
              e.currentTarget.value = "";
            }}
            style={{ width: "100%", padding: 10, marginTop: 8, marginBottom: 12 }}
          >
            <option value="" disabled>
              + Add move to order...
            </option>
            {availableMoves.map((m) => (
              <option key={m.id} value={m.id}>
                {moveLabel(m)}
              </option>
            ))}
          </select>

          {cycleOrder.length === 0 ? (
            <div style={{ opacity: 0.7, fontSize: 14 }}>No moves in the order yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cycleOrder.map((moveId, idx) => {
                const m = moveById.get(moveId);
                const label = m ? moveLabel(m) : `Missing move (${moveId})`;

                return (
                  <div
                    key={`${moveId}_${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: 10,
                      border: "1px solid rgba(0,0,0,0.10)",
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ flex: 1, fontSize: 14 }}>
                      <b>{idx + 1}.</b> {label}
                    </div>

                    <button onClick={() => moveUp(idx)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                      ↑
                    </button>
                    <button onClick={() => moveDown(idx)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                      ↓
                    </button>
                    <button
                      onClick={() => removeFromOrder(idx)}
                      style={{ padding: "4px 8px", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}