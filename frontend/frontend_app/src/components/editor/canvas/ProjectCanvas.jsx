/**
 * ProjectCanvas.jsx
 * Live preview panel for project mode.
 * Routes to the correct preview based on the selected project tree node.
 */

import { useEditor } from "@/state/editor/useEditor";
import CharacterPreview from "@/components/editor/canvas/project/CharacterPreview";
import { canvasContainer, canvasSectionTitle, COLOR_TEXT_SECONDARY } from "./canvasStyles";

export default function ProjectCanvas() {
  const { state } = useEditor();
  const { selectedNode, characters } = state.project;

  const containerStyle = {
    ...canvasContainer,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  if (!selectedNode) {
    return (
      <div style={containerStyle}>
        <div style={{ ...canvasSectionTitle, fontSize: 20, marginBottom: 0 }}>Live Preview</div>
      </div>
    );
  }

  if (selectedNode.kind === "character") {
    const character = characters.byId[selectedNode.characterId];
    if (!character) {
      return (
        <div style={containerStyle}>
          <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY }}>Character not found.</div>
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        <div style={{ ...canvasSectionTitle, fontSize: 20, marginBottom: 12, flexShrink: 0 }}>Live Preview</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CharacterPreview character={character} state={state} />
        </div>
      </div>
    );
  }

  // Project node, pool nodes — no preview yet
  return (
    <div style={containerStyle}>
      <div style={{ ...canvasSectionTitle, fontSize: 20, marginBottom: 0 }}>Live Preview</div>
    </div>
  );
}
