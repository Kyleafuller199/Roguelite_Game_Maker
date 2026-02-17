/**
 * EnemyBehavior.jsx
 *
 * Inspector section responsible for editing `enemy.behavior`.
 *
 * Current V1 Behavior Model:
 * - behaviorType: selects a behavior strategy (currently only "cycle" is implemented)
 * - cycleOrder: ordered list of move ids to execute in sequence
 *
 * JSON Shape Controlled Here:
 * enemy.behavior = {
 *   behaviorType: "cycle" | "custom",
 *   cycleOrder: string[]  // array of move ids, in execution order
 * }
 *
 * Notes:
 * - This component intentionally stores references by move id (not full move objects)
 *   to keep behavior data normalized and resilient to move edits.
 * - "custom" is currently treated the same as "cycle" (placeholder for future expansion).
 */

import { useMemo } from "react";
import Label from "../../../shared/Label";

const BEHAVIOR_TYPES = [
  { value: "cycle", label: "Cycle" },
  { value: "custom", label: "Custom (same as cycle for now)" },
];

/**
 * moveLabel
 * Small UI helper for rendering a move in dropdowns / lists.
 * (ID is intentionally hidden from the label for cleaner UI.)
 */
function moveLabel(m) {
  return m.name ?? "Unnamed Move";
}

// Shared button styling for small inline actions
const actionBtnStyle = {
  padding: "4px 8px",
  cursor: "pointer",
  flex: "0 0 auto",
  maxWidth: "100%",
};

export default function EnemyBehavior({ selected, update }) {
  /**
   * Read moves from the selected enemy.
   * useMemo avoids re-creating arrays/maps on unrelated renders.
   */
  const moves = useMemo(() => selected.moves ?? [], [selected.moves]);

  /**
   * Default behavior is a cycle with an empty order.
   * This prevents undefined access and keeps the UI stable.
   */
  const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };
  const cycleOrder = behavior.cycleOrder ?? [];

  /**
   * setBehavior
   * Replaces the entire behavior object. (Single owner: this section.)
   */
  function setBehavior(next) {
    update({ behavior: next });
  }

  /**
   * setType
   * Updates only the behavior strategy.
   */
  function setType(nextType) {
    setBehavior({ ...behavior, behaviorType: nextType });
  }

  /**
   * addToOrder
   * Appends a move id to the cycle order.
   */
  function addToOrder(moveId) {
    if (!moveId) return;
    setBehavior({ ...behavior, cycleOrder: [...cycleOrder, moveId] });
  }

  /**
   * removeFromOrder
   * Removes one entry from cycleOrder by index (not by id),
   * allowing duplicates of the same move id in the order if desired.
   */
  function removeFromOrder(index) {
    const next = cycleOrder.filter((_, i) => i !== index);
    setBehavior({ ...behavior, cycleOrder: next });
  }

  /**
   * moveUp / moveDown
   * Reorders a single entry within cycleOrder by swapping neighbors.
   */
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

  /**
   * Lookup table for rendering the move name from an id.
   * If a move id exists in cycleOrder but not in moves, we show "Missing move".
   */
  const moveById = new Map(moves.map((m) => [m.id, m]));

  // In V1 we expose all moves as selectable for the cycle order.
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

      {/* Empty state: no moves exist yet, so the user cannot build an order. */}
      {availableMoves.length === 0 ? (
        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 14 }}>
          Create moves above, then build the cycle order here.
        </div>
      ) : (
        <>
          {/* Add a move id to the order. We reset the select back to placeholder after adding. */}
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

          {/* Empty state: moves exist, but none have been added to the order. */}
          {cycleOrder.length === 0 ? (
            <div style={{ opacity: 0.7, fontSize: 14 }}>No moves in the order yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cycleOrder.map((moveId, idx) => {
                const m = moveById.get(moveId);
                const label = m ? moveLabel(m) : "Missing move";

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
                      maxWidth: "100%",
                      overflow: "hidden", // prevents action buttons from widening the inspector
                    }}
                  >
                    {/* Move name (ellipsis to prevent overflow) */}
                    <div
                      style={{
                        flex: "1 1 auto",
                        fontSize: 14,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={label}
                    >
                      <b>{idx + 1}.</b> {label}
                    </div>

                    <button onClick={() => moveUp(idx)} style={actionBtnStyle}>
                      ↑
                    </button>
                    <button onClick={() => moveDown(idx)} style={actionBtnStyle}>
                      ↓
                    </button>
                    <button onClick={() => removeFromOrder(idx)} style={actionBtnStyle}>
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