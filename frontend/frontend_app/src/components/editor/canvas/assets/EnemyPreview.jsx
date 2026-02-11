/**
 * EnemyPreview.jsx
 * Live preview for an enemy asset.
 */
export default function EnemyPreview({ selected }) {
  const identity = selected.identity ?? {};
  const moves = selected.moves ?? [];
  const behavior = selected.behavior ?? { behaviorType: "cycle", cycleOrder: [] };

  const moveById = new Map(moves.map((m) => [m.id, m]));

  return (
    <div style={{ opacity: 0.9 }}>
      {/* Identity */}
      <div style={{ marginBottom: 12 }}>
        <div>
          <b>{identity.name ?? "Unnamed Enemy"}</b>
        </div>
        <div>
          {identity.enemyType ?? "basic"} • Act {identity.act ?? 1}
        </div>
        <div>
          HP {identity.maxHealth ?? "?"} • Block {identity.startingBlock ?? 0}
        </div>
      </div>

      {/* Moves */}
      <Section title="Moves">
        {moves.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No moves defined</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {moves.map((m) => (
              <div key={m.id}>
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
                  <div style={{ opacity: 0.7 }}>No effects</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Behavior */}
      <Section title="Behavior">
        <div style={{ marginBottom: 8 }}>
          <b>Type:</b> {behavior.behaviorType ?? "cycle"}
        </div>

        {behavior.cycleOrder?.length ? (
          <ol style={{ margin: 0, paddingLeft: 18 }}>
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
          <div style={{ opacity: 0.7 }}>No behavior defined</div>
        )}
      </Section>
    </div>
  );
}

/* ---------- helpers ---------- */

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}