/**
 * EnemyPreview.jsx
 * Live preview for an enemy asset.
 */

import CanvasSection from "@/components/editor/canvas/CanvasSection";
import {
  canvasEntityName,
  canvasEntityMeta,
  canvasBodyText,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/canvas/canvasStyles";

export default function EnemyPreview({ selected }) {
  const identity = selected.identity ?? {};
  const moves = selected.moves ?? [];
  const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };

  const moveById = new Map(moves.map((m) => [m.id, m]));

  return (
    <div>
      {/* Identity header */}
      <div style={{ marginBottom: 12 }}>
        <div style={canvasEntityName}>{identity.name ?? "Unnamed Enemy"}</div>
        <div style={canvasEntityMeta}>
          {identity.enemyType ?? "basic"} • Act {identity.act ?? 1}
        </div>
        <div style={canvasEntityMeta}>
          HP {identity.maxHealth ?? "?"} • Block {identity.startingBlock ?? 0}
        </div>
      </div>

      {/* Moves */}
      <CanvasSection title="Moves">
        {moves.length === 0 ? (
          <div style={{ color: COLOR_TEXT_SECONDARY }}>No moves defined</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {moves.map((m) => (
              <div key={m.id} style={canvasBodyText}>
                <div style={{ fontWeight: 600 }}>{m.name ?? "Unnamed Move"}</div>
                {m.effects?.length ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {m.effects.map((e) => (
                      <li key={e.id}>
                        {e.effectType}
                        {e.baseValue != null ? ` (${e.baseValue})` : ""}
                        {e.target ? ` → ${e.target}` : ""}
                        {e.repeat ? ` x${e.repeat}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: COLOR_TEXT_SECONDARY }}>No effects</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CanvasSection>

      {/* Behavior */}
      <CanvasSection title="Behavior">
        <div style={{ ...canvasBodyText, marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Type:</span>{" "}
          {behavior.behaviorType ?? "cycle"}
        </div>

        {behavior.cycleOrder?.length ? (
          <ol style={{ margin: 0, paddingLeft: 18, ...canvasBodyText }}>
            {behavior.cycleOrder.map((moveId, i) => {
              const m = moveById.get(moveId);
              return (
                <li key={`${moveId}_${i}`}>
                  {m ? m.name ?? "Unnamed Move" : `Missing move (${moveId})`}
                </li>
              );
            })}
          </ol>
        ) : (
          <div style={{ color: COLOR_TEXT_SECONDARY }}>No behavior defined</div>
        )}
      </CanvasSection>
    </div>
  );
}
