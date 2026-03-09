/**
 * ProjectOverviewPreview.jsx
 * Live preview for the project "Info" node.
 * Shows: project name, pool summary counts, and characters list.
 */

import { useEditor } from "@/state/editor/useEditor";
import { canvasContainer, canvasSectionTitle, COLOR_TEXT_SECONDARY } from "../canvasStyles";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function ProjectOverviewPreview() {
  const { state } = useEditor();
  const { selectedNode, projects, characters } = state.project;

  const project = projects.byId[selectedNode.projectId];
  if (!project) return null;

  const projectChars = (project.characterIds ?? [])
    .map((id) => characters.byId[id])
    .filter(Boolean);
  const firstChar = projectChars[0] ?? null;

  const cardCount   = (firstChar?.cardPool  ?? []).length;
  const relicCount  = (firstChar?.relicPool ?? []).length;
  const potionCount = (project.pools.potions ?? []).length;

  // Derive enemy count from act assignments (union across all acts/roles)
  const actEnemyIds = new Set();
  Object.values(project.acts ?? {}).forEach((act) => {
    [...(act.basics ?? []), ...(act.elites ?? []), ...(act.bosses ?? [])].forEach((id) => actEnemyIds.add(id));
  });
  const enemyCount = actEnemyIds.size;

  const summaryItems = [
    { label: "Cards",    count: cardCount },
    { label: "Relics",   count: relicCount },
    { label: "Potions",  count: potionCount },
    { label: "Enemies",  count: enemyCount },
  ];

  return (
    <div style={{
      ...canvasContainer,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 32, overflow: "hidden",
    }}>

      {/* Project name */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#666", marginBottom: 8 }}>
          Project
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#e5e5e5" }}>
          {project.name ?? "Unnamed Project"}
        </div>
      </div>

      {/* Pool summary */}
      <div style={{ display: "flex", gap: 16 }}>
        {summaryItems.map(({ label, count }) => (
          <div key={label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "12px 20px",
            borderRadius: 12,
            backgroundColor: "#1e1c1b",
            border: "1px solid rgba(255,255,255,0.07)",
            minWidth: 72,
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#e5e5e5" }}>{count}</span>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#666" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Characters */}
      {projectChars.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#666" }}>
            Characters
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {projectChars.map((char) => (
              <div key={char.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 80, height: 80,
                  borderRadius: 12,
                  backgroundColor: "#1e1c1b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {char.imageUrl ? (
                    <img
                      src={`${API_BASE}/api/assets/file/?path=playable_characters/${char.imageUrl}`}
                      alt={char.name}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <div style={{ fontSize: 9, color: "#444", fontStyle: "italic" }}>No image</div>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>{char.name ?? "Unnamed"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projectChars.length === 0 && (
        <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY, fontStyle: "italic" }}>
          No characters yet.
        </div>
      )}

    </div>
  );
}
