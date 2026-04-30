/**
 * MapView.jsx
 *
 * Renders the run map as an interactive SVG.
 * Mirrors Kyle's pygame interactive_viewer fog-of-war:
 *   only the current row + the next row are visible at any time.
 *
 * Coordinate system:
 *   Kyle's data has y=100 at the top (start) and y=700 at the bottom (boss).
 *   We flip the y-axis so the boss appears at the TOP, start at the BOTTOM.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const MAP_W     = 1200;
const MAP_H     = 800;
const ICON_SIZE = 52;

function fy(y) {
  return MAP_H - y;
}

export default function MapView({
  mapData,
  currentNodeId,
  visitedIds = new Set(),
  onNodeClick,
  midCombatNodeId = null,
}) {
  if (!mapData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>
        Generating map…
      </div>
    );
  }

  const nodes = Object.values(mapData.nodes);

  // ── Which nodes can the player click right now ───────────────────────────
  const currentNode = currentNodeId !== null ? mapData.nodes[currentNodeId] : null;
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
      {/* Parchment background */}
      <image
        href={`${API_BASE}/api/assets/file/?path=icons/parchment.png`}
        x={0} y={0} width={MAP_W} height={MAP_H}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Connection lines ───────────────────────────────────────────────── */}
      {nodes.map(node =>
        node.connections.map(targetId => {
          const target = mapData.nodes[targetId];
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

      {/* Nodes ──────────────────────────────────────────────────────────── */}
      {nodes.map(node => {

        const isVisited   = visitedIds.has(node.id);
        const isCurrent   = node.id === currentNodeId;
        const isReachable = reachableIds.has(node.id);
        const isMidCombat = midCombatNodeId !== null && node.id === midCombatNodeId;

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
            {/* ── Rings ──────────────────────────────────────────────── */}

            {/* Mid-combat: red dashed ring */}
            {isMidCombat && (
              <circle
                cx={node.x} cy={dy} r={42}
                fill="rgba(220,50,50,0.1)"
                stroke="rgba(220,50,50,0.9)"
                strokeWidth={3}
                strokeDasharray="6 3"
              />
            )}

            {/* Reachable: bright gold filled glow ring */}
            {isClickable && !isMidCombat && (
              <>
                <circle
                  cx={node.x} cy={dy} r={42}
                  fill="rgba(240,192,48,0.18)"
                  stroke="rgba(240,192,48,0.95)"
                  strokeWidth={3}
                />
                {/* Inner pulse ring */}
                <circle
                  cx={node.x} cy={dy} r={34}
                  fill="none"
                  stroke="rgba(255,220,80,0.4)"
                  strokeWidth={1.5}
                />
              </>
            )}

            {/* Current node: white ring */}
            {isCurrent && !isClickable && (
              <circle
                cx={node.x} cy={dy} r={36}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={2}
              />
            )}

            {/* ── Icon ───────────────────────────────────────────────── */}
            <image
              href={`${API_BASE}/api/assets/file/?path=icons/${node.type}.png`}
              x={node.x - ICON_SIZE / 2}
              y={dy - ICON_SIZE / 2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              opacity={
                isMidCombat   ? 1    :
                isVisited     ? 0.25 :
                isClickable   ? 1    :
                isCurrent     ? 0.8  : 0.5
              }
            />

            {/* ── Label — pill background for readability on parchment ── */}
            {isClickable && (
              <rect
                x={node.x - 32} y={dy + ICON_SIZE / 2 + 4}
                width={64} height={16}
                rx={4}
                fill="rgba(20,14,6,0.55)"
              />
            )}
            <text
              x={node.x}
              y={dy + ICON_SIZE / 2 + 15}
              textAnchor="middle"
              fill={
                isMidCombat ? "#ff6060" :
                isClickable ? "#ffe680" :
                isVisited   ? "#666"    : "#888"
              }
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
