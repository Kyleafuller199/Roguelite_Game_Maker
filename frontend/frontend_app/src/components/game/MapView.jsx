/**
 * MapView.jsx
 *
 * Renders the run map as an interactive SVG — a React port of
 * Kyle's pygame interactive_viewer. Uses the same node data,
 * icon images, and connection logic; just drawn in the browser.
 *
 * Coordinate system:
 *   Kyle's generator places y=100 at the top (start) and y=700 at the
 *   bottom (boss). We flip the y-axis so the boss is at the TOP of the
 *   screen and the start node is at the BOTTOM — players progress upward.
 *
 * Visual rules:
 *   - Gold ring  = clickable (reachable) node
 *   - Red ring   = paused mid-combat node (only this one is clickable)
 *   - White ring = current node (already visited)
 *   - Lines to reachable nodes are drawn brighter and thicker
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const MAP_W     = 1200;
const MAP_H     = 800;
const ICON_SIZE = 52;

// Flip y so the boss (high y in data) appears at the top of the screen
function fy(y) {
  return MAP_H - y;
}

export default function MapView({
  mapData,
  currentNodeId,              // which node the player is currently on
  visitedIds = new Set(),     // nodes already completed
  onNodeClick,                // called when a clickable node is selected
  midCombatNodeId = null,     // if set, only this node is clickable (red ring)
}) {
  if (!mapData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>
        Generating map…
      </div>
    );
  }

  const nodes = Object.values(mapData.nodes);

  // ── Compute which nodes the player can click ───────────────────────────────
  // Before any move: only start nodes are reachable.
  // After a move: the current node's connections become reachable.
  // Uses strict null check — start node id is 0 which is falsy, so
  // a truthiness check would incorrectly treat it as "no current node".
  const currentNode  = currentNodeId !== null ? mapData.nodes[currentNodeId] : null;
  const reachableIds = new Set();
  if (currentNodeId === null) {
    nodes.filter(n => n.type === "start").forEach(n => reachableIds.add(n.id));
  } else {
    if (currentNode) currentNode.connections.forEach(id => reachableIds.add(id));
  }

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Parchment background — same asset Kyle used in pygame */}
      <image
        href={`${API_BASE}/api/assets/file/?path=icons/parchment.png`}
        x={0} y={0} width={MAP_W} height={MAP_H}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* ── Connection lines ─────────────────────────────────────────────── */}
      {/* Lines leading to reachable nodes are drawn brighter and thicker   */}
      {nodes.map(node =>
        node.connections.map(targetId => {
          const target      = mapData.nodes[targetId];
          if (!target) return null;
          const toReachable = reachableIds.has(targetId);
          return (
            <line
              key={`${node.id}-${targetId}`}
              x1={node.x} y1={fy(node.y)}
              x2={target.x} y2={fy(target.y)}
              stroke={toReachable ? "rgba(180,130,20,0.85)" : "rgba(80,50,20,0.4)"}
              strokeWidth={toReachable ? 4 : 2}
            />
          );
        })
      )}

      {/* ── Nodes ────────────────────────────────────────────────────────── */}
      {nodes.map(node => {
        const isVisited   = visitedIds.has(node.id);
        const isCurrent   = node.id === currentNodeId;
        const isReachable = reachableIds.has(node.id);

        // Mid-combat mode: only the paused fight node is clickable
        const isMidCombat = midCombatNodeId !== null && node.id === midCombatNodeId;
        const isClickable = midCombatNodeId !== null
          ? isMidCombat
          : isReachable && !isVisited;

        const dy = fy(node.y); // flipped y position for this node

        return (
          <g
            key={node.id}
            onClick={() => isClickable && onNodeClick(node)}
            style={{ cursor: isClickable ? "pointer" : "default" }}
          >
            {/* ── Ring indicators ──────────────────────────────────────── */}

            {/* Red dashed ring: mid-combat node (click to resume fight) */}
            {isMidCombat && (
              <circle
                cx={node.x} cy={dy} r={42}
                fill="rgba(220,50,50,0.1)"
                stroke="rgba(220,50,50,0.9)"
                strokeWidth={3}
                strokeDasharray="6 3"
              />
            )}

            {/* Gold ring: this node is reachable and can be clicked */}
            {isClickable && !isMidCombat && (
              <>
                <circle
                  cx={node.x} cy={dy} r={42}
                  fill="rgba(240,192,48,0.18)"
                  stroke="rgba(240,192,48,0.95)"
                  strokeWidth={3}
                />
                <circle cx={node.x} cy={dy} r={34} fill="none" stroke="rgba(255,220,80,0.4)" strokeWidth={1.5} />
              </>
            )}

            {/* White ring: node the player is currently standing on */}
            {isCurrent && !isClickable && (
              <circle cx={node.x} cy={dy} r={36} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
            )}

            {/* ── Node icon (battle, rest, treasure, etc.) ─────────────── */}
            <image
              href={`${API_BASE}/api/assets/file/?path=icons/${node.type}.png`}
              x={node.x - ICON_SIZE / 2}
              y={dy - ICON_SIZE / 2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              opacity={
                isMidCombat ? 1    :
                isVisited   ? 0.25 :
                isClickable ? 1    :
                isCurrent   ? 0.8  : 0.5
              }
            />

            {/* ── Label with dark pill background for parchment readability */}
            {isClickable && (
              <rect x={node.x - 32} y={dy + ICON_SIZE / 2 + 4} width={64} height={16} rx={4} fill="rgba(20,14,6,0.55)" />
            )}
            <text
              x={node.x}
              y={dy + ICON_SIZE / 2 + 15}
              textAnchor="middle"
              fill={isMidCombat ? "#ff6060" : isClickable ? "#ffe680" : isVisited ? "#666" : "#888"}
              fontSize={isClickable ? 12 : 10}
              fontFamily="Inter, sans-serif"
              fontWeight={isClickable ? 700 : 400}
              style={{ textTransform: "capitalize" }}
            >
              {node.type}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
