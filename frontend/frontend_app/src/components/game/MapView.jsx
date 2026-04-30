/**
 * MapView.jsx
 *
 * Renders the run map as an interactive SVG.
 * Ported from Kyle's pygame interactive_viewer — same fog-of-war logic,
 * same icon images, same connection lines. Just drawn in the browser instead.
 *
 * Coordinate system:
 *   Kyle's data has y=100 at the top (start) and y=700 at the bottom (boss).
 *   We flip the y-axis so the boss appears at the TOP and the start is at the
 *   BOTTOM — the player progresses upward through the map.
 *
 * Props:
 *   mapData       — JSON from GET /api/game/map/
 *   currentNodeId — id of the node the player is currently on (null = not started)
 *   visitedIds    — Set of node ids already completed
 *   onNodeClick   — called with the node object when a reachable node is clicked
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const MAP_W     = 1200;
const MAP_H     = 800;
const ICON_SIZE = 48;

// Flip y so the boss (originally near y=700) appears at the top of the screen
function fy(y) {
  return MAP_H - y;
}

export default function MapView({ mapData, currentNodeId, visitedIds = new Set(), onNodeClick, midCombatNodeId = null }) {
  if (!mapData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>
        Generating map…
      </div>
    );
  }

  const nodes = Object.values(mapData.nodes);

  // Work out which nodes the player can click right now.
  // Mirrors Kyle's fog-of-war: only current row + the next row are visible/reachable.
  const reachableIds = new Set();
  if (currentNodeId === null) {
    // Run hasn't started — only the start node is clickable
    nodes.filter(n => n.type === "start").forEach(n => reachableIds.add(n.id));
  } else {
    const current = mapData.nodes[currentNodeId];
    if (current) current.connections.forEach(id => reachableIds.add(id));
  }

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Parchment background — same as Kyle's pygame version */}
      <image
        href={`${API_BASE}/api/assets/file/?path=icons/parchment.png`}
        x={0} y={0} width={MAP_W} height={MAP_H}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Connection lines — draw first so they sit behind the icons */}
      {nodes.map(node =>
        node.connections.map(targetId => {
          const target = mapData.nodes[targetId];
          if (!target) return null;
          return (
            <line
              key={`${node.id}-${targetId}`}
              x1={node.x}      y1={fy(node.y)}
              x2={target.x}    y2={fy(target.y)}
              stroke="rgba(80,50,20,0.6)"
              strokeWidth={3}
            />
          );
        })
      )}

      {/* Nodes */}
      {nodes.map(node => {
        const isVisited      = visitedIds.has(node.id);
        const isCurrent      = node.id === currentNodeId;
        const isReachable    = reachableIds.has(node.id);
        const isMidCombat    = midCombatNodeId !== null && node.id === midCombatNodeId;

        // In mid-combat mode only the paused node is clickable; otherwise normal rules apply
        const isClickable = midCombatNodeId !== null
          ? isMidCombat
          : isReachable && !isVisited;

        const dy = fy(node.y);

        return (
          <g
            key={node.id}
            onClick={() => isClickable && onNodeClick(node)}
            style={{ cursor: isClickable ? "pointer" : "default" }}
          >
            {/* Red pulsing ring on the paused combat node */}
            {isMidCombat && (
              <circle
                cx={node.x} cy={dy} r={38}
                fill="none"
                stroke="rgba(220,50,50,0.9)"
                strokeWidth={3}
                strokeDasharray="6 3"
              />
            )}

            {/* Gold glow ring on normally reachable nodes */}
            {isClickable && !isMidCombat && (
              <circle
                cx={node.x} cy={dy} r={34}
                fill="none"
                stroke="rgba(240,192,48,0.6)"
                strokeWidth={2}
              />
            )}

            {/* Current node indicator */}
            {isCurrent && (
              <circle
                cx={node.x} cy={dy} r={34}
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={2}
              />
            )}

            {/* Icon image — the same PNGs Kyle loaded in pygame */}
            <image
              href={`${API_BASE}/api/assets/file/?path=icons/${node.type}.png`}
              x={node.x - ICON_SIZE / 2}
              y={dy       - ICON_SIZE / 2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              opacity={
                isVisited   ? 0.2 :
                isMidCombat ? 1 :
                midCombatNodeId !== null ? 0.2 :
                isReachable || isCurrent ? 1 : 0.35
              }
            />

            {/* Node type label */}
            <text
              x={node.x}
              y={dy + ICON_SIZE / 2 + 16}
              textAnchor="middle"
              fill={isVisited ? "#555" : isReachable ? "#e5e5e5" : "#777"}
              fontSize={11}
              fontFamily="Inter, sans-serif"
              fontWeight={isReachable ? 700 : 400}
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
