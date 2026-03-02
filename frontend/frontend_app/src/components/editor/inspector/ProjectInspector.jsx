/**
 * ProjectInspector.jsx
 *
 * Inspector panel for project mode.
 * Routes to the correct inspector based on the selected project tree node kind.
 *
 * Supported node kinds:
 * - "project"   → ProjectNodeInspector  (overview + Start Run)
 * - "pool"      → pool inspector        (cards / relics / potions / enemies)
 * - "character" → CharacterInspector    (starting relic, starting deck)
 *
 * @param {object} state   - Full editor state
 * @param {object} actions - Editor actions
 */

import CardPoolInspector    from "@/components/editor/inspector/project/pools/CardPoolInspector";
import RelicPoolInspector   from "@/components/editor/inspector/project/pools/RelicPoolInspector";
import PotionPoolInspector  from "@/components/editor/inspector/project/pools/PotionPoolInspector";
import EnemyPoolInspector   from "@/components/editor/inspector/project/pools/EnemyPoolInspector";
import CharacterInspector   from "@/components/editor/inspector/project/CharacterInspector";
import ProjectNodeInspector from "@/components/editor/inspector/project/ProjectNodeInspector";
import {
  COLOR_SIDEBAR_BG,
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
  sectionHeaderTitle,
} from "@/components/editor/shared/sidebarStyles";

const deleteBtnStyle = {
  padding: "2px 8px",
  fontSize: 12,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  color: COLOR_TEXT_SECONDARY,
  cursor: "pointer",
};

const POOL_INSPECTORS = {
  cards:   CardPoolInspector,
  relics:  RelicPoolInspector,
  potions: PotionPoolInspector,
  enemies: EnemyPoolInspector,
};

const POOL_LABELS = {
  cards:   "Card Pool",
  relics:  "Relic Pool",
  potions: "Potion Pool",
  enemies: "Enemy Pool",
};

const rootStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  backgroundColor: COLOR_SIDEBAR_BG,
  color: COLOR_TEXT_MAIN,
};

const stickyHeaderStyle = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  height: 40,
  backgroundColor: COLOR_SIDEBAR_BG,
  boxSizing: "border-box",
  flexShrink: 0,
};

function EmptyState({ message }) {
  return (
    <div style={{ ...rootStyle, padding: 12, fontSize: 13, color: COLOR_TEXT_SECONDARY }}>
      {message}
    </div>
  );
}

function InspectorShell({ title, headerAction, children }) {
  return (
    <div style={rootStyle}>
      <div style={{ ...stickyHeaderStyle, justifyContent: "space-between" }}>
        <span style={sectionHeaderTitle}>{title}</span>
        {headerAction}
      </div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

export default function ProjectInspector({ state, actions }) {
  const { selectedNode, projects, characters } = state.project;

  if (!selectedNode) {
    return <EmptyState message="Select a project node to inspect it." />;
  }

  const project = projects.byId[selectedNode.projectId];
  if (!project) {
    return <EmptyState message="Project not found." />;
  }

  // ── "project" node — overview + Start Run ──────────────────
  if (selectedNode.kind === "project") {
    function handleDeleteProject() {
      const ok = window.confirm(`Delete "${project.name ?? "this project"}"? This cannot be undone.`);
      if (!ok) return;
      actions.deleteProject(project.id);
    }

    return (
      <InspectorShell
        title={project.name}
        headerAction={
          <button onClick={handleDeleteProject} style={deleteBtnStyle}>Delete</button>
        }
      >
        <ProjectNodeInspector project={project} state={state} actions={actions} />
      </InspectorShell>
    );
  }

  // ── "pool" node — pool asset toggles ───────────────────────
  if (selectedNode.kind === "pool") {
    const PoolInspector = POOL_INSPECTORS[selectedNode.pool];
    if (!PoolInspector) return <EmptyState message="Unknown pool type." />;

    return (
      <InspectorShell title={POOL_LABELS[selectedNode.pool]}>
        <PoolInspector project={project} state={state} actions={actions} />
      </InspectorShell>
    );
  }

  // ── "character" node — starting relic + starting deck ──────
  if (selectedNode.kind === "character") {
    const character = characters.byId[selectedNode.characterId];
    if (!character) return <EmptyState message="Character not found." />;

    function handleDelete() {
      const ok = window.confirm(`Delete "${character.name ?? "this character"}"? This cannot be undone.`);
      if (!ok) return;
      actions.deleteCharacter(project.id, character.id);
    }

    return (
      <InspectorShell
        title={character.name ?? "Character"}
        headerAction={
          <button onClick={handleDelete} style={deleteBtnStyle}>Delete</button>
        }
      >
        <CharacterInspector
          character={character}
          project={project}
          state={state}
          actions={actions}
        />
      </InspectorShell>
    );
  }

  return <EmptyState message="Select a project node to inspect it." />;
}
