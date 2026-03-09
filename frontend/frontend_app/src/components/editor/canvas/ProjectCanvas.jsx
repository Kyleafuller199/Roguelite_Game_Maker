/**
 * ProjectCanvas.jsx
 * Live preview panel for project mode.
 * Routes to the correct preview based on the selected project tree node.
 *
 * kind="project"       → ProjectOverviewPreview
 * kind="pool"          → PoolPreview  (project-level: potions, enemies)
 * kind="characterPool" → PoolPreview  (character-level: cards, relics)
 * kind="character"     → CharacterPreview
 */

import { useEditor } from "@/state/editor/useEditor";
import CharacterPreview       from "@/components/editor/canvas/project/CharacterPreview";
import PoolPreview            from "@/components/editor/canvas/project/PoolPreview";
import ProjectOverviewPreview from "@/components/editor/canvas/project/ProjectOverviewPreview";
import { canvasContainer, COLOR_TEXT_SECONDARY } from "./canvasStyles";

export default function ProjectCanvas() {
  const { state } = useEditor();
  const { selectedNode, characters } = state.project;

  if (!selectedNode) {
    return (
      <div style={canvasContainer}>
        <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY }}>Select a project node to preview it.</div>
      </div>
    );
  }

  if (selectedNode.kind === "project") {
    return <ProjectOverviewPreview />;
  }

  if (selectedNode.kind === "pool" || selectedNode.kind === "characterPool") {
    return <PoolPreview />;
  }

  if (selectedNode.kind === "character") {
    const character = characters.byId[selectedNode.characterId];
    if (!character) {
      return (
        <div style={canvasContainer}>
          <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY }}>Character not found.</div>
        </div>
      );
    }
    return (
      <div style={{ ...canvasContainer, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CharacterPreview character={character} state={state} />
        </div>
      </div>
    );
  }

  return (
    <div style={canvasContainer}>
      <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY }}>Select a project node to preview it.</div>
    </div>
  );
}
