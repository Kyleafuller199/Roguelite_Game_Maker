/**
 * ProjectSidebar.jsx
 *
 * Left panel content for project mode.
 *
 * Tree structure per project:
 *   ▾ Project Name          ← clicking header only toggles expand
 *       Info                ← selects project node (name + Start Run inspector)
 *     ▾ Pools
 *         Card Pool
 *         Relic Pool
 *         Potion Pool
 *         Enemy Pool
 *     ▾ Characters
 *         + New Character   ← opens NewCharacterModal
 *         Character Name
 *
 * Selection state and expansion state live in EditorContext.
 */

import { useState } from "react";
import { useEditor } from "@/state/editor/useEditor";
import CollapsibleSection from "@/components/editor/shared/CollapsibleSection";
import SidebarItem from "@/components/editor/shared/SidebarItem";
import NewCharacterModal from "@/components/editor/sidebar/modal/NewCharacterModal";

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

  // Track which project's "New Character" modal is open (null = closed)
  const [charModalProjectId, setCharModalProjectId] = useState(null);

  const allProjects = projects.allIds.map((id) => projects.byId[id]).filter(Boolean);

  return (
    <div>
      {allProjects.map((project) => {
        const projectExpanded = expanded[`project:${project.id}`]            ?? true;
        const poolsExpanded   = expanded[`project:${project.id}:pools`]      ?? true;
        const charsExpanded   = expanded[`project:${project.id}:characters`] ?? true;

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

            {/* ── Info item ─────────────────────────────────── */}
            <SidebarItem
              label="Info"
              selected={isNodeSelected(selectedNode, "project", project.id)}
              onClick={() => actions.selectProjectNode({ kind: "project", projectId: project.id })}
              indent={1}
            />

            {/* ── Pools sub-section ─────────────────────────── */}
            <CollapsibleSection
              title="Pools"
              isOpen={poolsExpanded}
              onToggle={() => actions.toggleProjectExpanded(`project:${project.id}:pools`)}
            >
              {POOLS.map(({ key, label }) => (
                <SidebarItem
                  key={key}
                  label={label}
                  selected={isNodeSelected(selectedNode, "pool", project.id, { pool: key })}
                  onClick={() => actions.selectProjectNode({ kind: "pool", projectId: project.id, pool: key })}
                  indent={1}
                />
              ))}
            </CollapsibleSection>

            {/* ── Characters sub-section ────────────────────── */}
            <CollapsibleSection
              title="Characters"
              isOpen={charsExpanded}
              onToggle={() => actions.toggleProjectExpanded(`project:${project.id}:characters`)}
            >
              <SidebarItem
                label="+ New Character"
                selected={false}
                onClick={() => setCharModalProjectId(project.id)}
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

      {/* ── New Character modal (portal) ─────────────────────── */}
      <NewCharacterModal
        isOpen={charModalProjectId !== null}
        onClose={() => setCharModalProjectId(null)}
        onCreate={(name) => {
          if (charModalProjectId) actions.createCharacter(charModalProjectId, name);
        }}
      />
    </div>
  );
}
