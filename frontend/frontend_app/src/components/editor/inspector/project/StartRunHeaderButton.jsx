/**
 * StartRunHeaderButton.jsx
 *
 * Persistent "Start Run" button shown in the AppHeader while the editor is open.
 * Reads editor state via useEditor() to find the selected (or first available)
 * project and checks the same validity conditions as ProjectNodeInspector.
 *
 * Enabled when: a project exists with at least one character that has a sprite
 * and a starting deck, and Act 1 has at least one enemy with a sprite assigned.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor } from "@/state/editor/useEditor";
import { buildRunPayload } from "@/state/editor/project/payload";

export default function StartRunHeaderButton() {
  const { state } = useEditor();
  const navigate   = useNavigate();
  const [hovered, setHovered] = useState(false);

  // Use the project whose root node is currently selected, or the first project
  const { selectedNode, projects, characters } = state.project;
  const projectId =
    selectedNode?.projectId ?? projects.allIds[0] ?? null;
  const project   = projectId ? projects.byId[projectId] : null;

  // Validity checks (mirrors ProjectNodeInspector.canStart)
  const chars = (project?.characterIds ?? [])
    .map(id => characters.byId[id])
    .filter(Boolean);
  const firstChar      = chars[0] ?? null;
  const hasDeck        = (firstChar?.startingDeck?.length ?? 0) > 0;
  const hasCharImg     = !!firstChar?.imageUrl;
  const act1           = project?.acts?.["1"] ?? {};
  const act1EnemyIds   = [...(act1.basics ?? []), ...(act1.elites ?? [])];
  const hasAct1Enemies = act1EnemyIds.length > 0;
  const enemiesHaveImg = act1EnemyIds.every(
    id => !!state.assets.enemies.byId[id]?.imageUrl
  );
  const canStart = !!firstChar && hasCharImg && hasDeck && hasAct1Enemies && enemiesHaveImg;

  function handleClick() {
    if (!canStart || !project) return;

    if (chars.length > 1) {
      const payloads = {};
      for (const char of chars) {
        const p = buildRunPayload(state, project.id, char.id);
        if (p) payloads[char.id] = p;
      }
      sessionStorage.setItem("characterSelectData", JSON.stringify({
        characters: chars.map(c => ({ id: c.id, name: c.name, imageUrl: c.imageUrl ?? "" })),
        payloads,
      }));
      sessionStorage.removeItem("runPayload");
    } else {
      const payload = buildRunPayload(state, project.id);
      if (!payload) return;
      sessionStorage.setItem("runPayload", JSON.stringify(payload));
      sessionStorage.removeItem("characterSelectData");
    }

    navigate("/play");
  }

  // Only show in project mode
  if (state.mode !== "project" || !project) return null;

  return (
    <button
      onClick={handleClick}
      disabled={!canStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={canStart ? `Start run — ${project.name}` : "Project is not ready to run"}
      style={{
        padding: "6px 16px",
        fontSize: 13, fontWeight: 600,
        border: "none", borderRadius: 6,
        cursor: canStart ? "pointer" : "not-allowed",
        background: canStart
          ? hovered ? "#2a7a40" : "#226635"
          : "#2a2a2a",
        color: canStart ? "#fff" : "#555",
        transition: "background 0.15s",
      }}
    >
      ▶ Start Run
    </button>
  );
}
