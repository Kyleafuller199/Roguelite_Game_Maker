/**
 * ProjectInspector.jsx
 *
 * Inspector panel for project mode.
 * Routes to the correct pool inspector based on the selected project tree node.
 *
 * Supported node kinds:
 * - "pool" → renders the matching pool inspector (cards/relics/potions/enemies)
 * - others → shows an empty-state prompt
 *
 * @param {object} state   - Full editor state
 * @param {object} actions - Editor actions
 */

import CardPoolInspector from "@/components/editor/inspector/project/pools/CardPoolInspector";
import RelicPoolInspector from "@/components/editor/inspector/project/pools/RelicPoolInspector";
import PotionPoolInspector from "@/components/editor/inspector/project/pools/PotionPoolInspector";
import EnemyPoolInspector from "@/components/editor/inspector/project/pools/EnemyPoolInspector";
import {
  COLOR_SIDEBAR_BG,
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
  sectionHeaderTitle,
} from "@/components/editor/shared/sidebarStyles";

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

export default function ProjectInspector({ state, actions }) {
  const { selectedNode, projects } = state.project;

  if (!selectedNode || selectedNode.kind !== "pool") {
    return <EmptyState message="Select a pool to configure it." />;
  }

  const project = projects.byId[selectedNode.projectId];
  if (!project) {
    return <EmptyState message="Project not found." />;
  }

  const PoolInspector = POOL_INSPECTORS[selectedNode.pool];
  if (!PoolInspector) {
    return <EmptyState message="Unknown pool type." />;
  }

  return (
    <div style={rootStyle}>

      {/* Sticky header */}
      <div style={stickyHeaderStyle}>
        <span style={sectionHeaderTitle}>
          {POOL_LABELS[selectedNode.pool]}
        </span>
      </div>

      {/* Scrollable pool content */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <PoolInspector project={project} state={state} actions={actions} />
      </div>

    </div>
  );
}
