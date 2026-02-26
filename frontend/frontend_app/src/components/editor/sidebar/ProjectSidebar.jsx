/**
 * ProjectSidebar.jsx
 *
 * Left panel content for project mode.
 *
 * Renders a collapsible tree for each project:
 *   ▾ Project Name
 *       Card Pool
 *       Relic Pool
 *       Potion Pool
 *       Enemy Pool
 *     ▾ Characters
 *         + New Character
 *         Character Name
 *
 * Selection state and expansion state live in EditorContext.
 */

import { useEditor } from "@/state/editor/useEditor";
import CollapsibleSection from "@/components/editor/shared/CollapsibleSection";
import SidebarItem from "@/components/editor/shared/SidebarItem";

const POOLS = [
  { key: "cards",   label: "Card Pool" },
  { key: "relics",  label: "Relic Pool" },
  { key: "potions", label: "Potion Pool" },
  { key: "enemies", label: "Enemy Pool" },
];

function isNodeSelected(selectedNode, kind, projectId, extra = {}) {
  if (!selectedNode || selectedNode.kind !== kind || selectedNode.projectId !== projectId) return false;
  if (kind === "pool")      return selectedNode.pool === extra.pool;
  if (kind === "character") return selectedNode.characterId === extra.characterId;
  return true;
}

export default function ProjectSidebar() {
  const { state, actions } = useEditor();
  const { projects, characters, expanded, selectedNode } = state.project;

  const allProjects = projects.allIds.map((id) => projects.byId[id]).filter(Boolean);

  return (
    <div>
      {allProjects.map((project) => {
        const projectExpanded  = expanded[`project:${project.id}`] ?? true;
        const charsExpanded    = expanded[`project:${project.id}:characters`] ?? true;

        const projectChars = (project.characterIds ?? [])
          .map((cId) => characters.byId[cId])
          .filter(Boolean);

        return (
          <CollapsibleSection
            key={project.id}
            title={project.name}
            isOpen={projectExpanded}
            onToggle={() => actions.toggleProjectExpanded(`project:${project.id}`)}
          >

            {/* ── Asset pools ───────────────────────────────── */}
            {POOLS.map(({ key, label }) => (
              <SidebarItem
                key={key}
                label={label}
                selected={isNodeSelected(selectedNode, "pool", project.id, { pool: key })}
                onClick={() => actions.selectProjectNode({ kind: "pool", projectId: project.id, pool: key })}
                indent={1}
              />
            ))}

            {/* ── Characters sub-section ────────────────────── */}
            <CollapsibleSection
              title="Characters"
              isOpen={charsExpanded}
              onToggle={() => actions.toggleProjectExpanded(`project:${project.id}:characters`)}
            >
              <SidebarItem
                label="+ New Character"
                selected={false}
                onClick={() => actions.createCharacter(project.id)}
                indent={1}
              />

              {projectChars.map((char) => (
                <SidebarItem
                  key={char.id}
                  label={char.name ?? "Unnamed Character"}
                  selected={isNodeSelected(selectedNode, "character", project.id, { characterId: char.id })}
                  onClick={() => actions.selectProjectNode({ kind: "character", projectId: project.id, characterId: char.id })}
                  indent={1}
                />
              ))}
            </CollapsibleSection>

          </CollapsibleSection>
        );
      })}
    </div>
  );
}
