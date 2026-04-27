/**
 * ProjectNodeInspector.jsx
 *
 * Inspector shown when the project root node is selected in the sidebar tree.
 * Mirrors the role of CardInspector/RelicInspector etc. but for the "project"
 * node kind in project mode.
 *
 * Sections:
 * - Project Info — editable project name
 * - Overview     — stat summary + Start Run button
 *
 * @param {object} project - The active project object
 * @param {object} state   - Full editor state
 * @param {object} actions - Editor actions
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildRunPayload } from "@/state/editor/project/payload";
import InspectorSection from "@/components/editor/inspector/shared/InspectorSection";
import Label from "@/components/editor/inspector/shared/Label";
import {
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/shared/sidebarStyles";

// ── Styles ────────────────────────────────────────────────────────────────────

const statRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "7px 12px",
  fontSize: 13,
  color: COLOR_TEXT_SECONDARY,
  borderBottom: "1px solid rgba(255,255,255,0.04)",
};

function startBtnStyle(disabled, hovered) {
  return {
    width: "100%",
    padding: "10px 0",
    marginTop: 16,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#2a2a2a" : hovered ? "#2a7a40" : "#226635",
    color: disabled ? "#555" : "#fff",
    transition: "background 0.15s",
  };
}

function exportBtnStyle(disabled) {
  return {
    width: "100%",
    padding: "8px 0",
    marginTop: 8,
    fontSize: 13,
    fontWeight: 500,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    background: "transparent",
    color: disabled ? "#555" : "#aaa",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProjectNodeInspector({ project, state, actions }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [status, setStatus]   = useState(null);

  const characters = (project.characterIds ?? [])
    .map((id) => state.project.characters.byId[id])
    .filter(Boolean);

  const firstChar = characters[0] ?? null;

  const actEnemyCount = new Set(
    Object.values(project.acts ?? {}).flatMap((act) => [
      ...(act.basics ?? []), ...(act.elites ?? []), ...(act.bosses ?? []),
    ])
  ).size;
  const hasDeck        = (firstChar?.startingDeck?.length ?? 0) > 0;
  const hasCharImg     = !!firstChar?.imageUrl;
  const act1           = project.acts?.["1"] ?? {};
  const act1EnemyIds   = [...(act1.basics ?? []), ...(act1.elites ?? [])];
  const hasAct1Enemies = act1EnemyIds.length > 0;
  const enemiesHaveImg = act1EnemyIds.every(id => !!state.assets.enemies.byId[id]?.imageUrl);

  const canStart = !!firstChar && hasCharImg && hasDeck && hasAct1Enemies && enemiesHaveImg;

  const hints = [];
  if (!firstChar)          hints.push("Add at least one character");
  else if (!hasCharImg)    hints.push("Character needs a sprite image");
  else if (!hasDeck)       hints.push("Character needs a starting deck");
  if (!hasAct1Enemies)     hints.push("Act 1 needs at least one enemy assigned");
  else if (!enemiesHaveImg) hints.push("All Act 1 enemies need a sprite image set");

  function handleExport() {
    const payload = buildRunPayload(state, project.id);
    if (!payload) { setStatus("error"); return; }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "run_config.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function handleStartRun() {
    const payload = buildRunPayload(state, project.id);
    if (!payload) { setStatus("error"); return; }
    sessionStorage.setItem("runPayload", JSON.stringify(payload));
    navigate("/play");
  }

  return (
    <>
      {/* ── Project Info ──────────────────────────────────────── */}
      <InspectorSection title="Project Info">
        <Label>Name</Label>
        <input
          value={project.name ?? ""}
          onChange={(e) => actions.updateProject(project.id, { name: e.target.value })}
          placeholder="Project name"
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />
      </InspectorSection>

      {/* ── Overview + Start Run ──────────────────────────────── */}
      <InspectorSection title="Overview">
        <div style={{ marginBottom: 4 }}>
          {[
            ["Characters",      characters.length],
            ["Cards in pool",   firstChar?.cardPool?.length    ?? 0],
            ["Relics in pool",  firstChar?.relicPool?.length   ?? 0],
            ["Potions in pool", project.pools?.potions?.length ?? 0],
            ["Enemies in pool", actEnemyCount],
          ].map(([label, count]) => (
            <div key={label} style={statRow}>
              <span>{label}</span>
              <span style={{ color: COLOR_TEXT_MAIN, fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>

        {hints.length > 0 && (
          <div style={{ fontSize: 12, color: "#e57c3a", marginTop: 10, lineHeight: 1.6 }}>
            {hints.map((h) => <div key={h}>• {h}</div>)}
          </div>
        )}

        <button
          disabled={!canStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleStartRun}
          style={startBtnStyle(!canStart, hovered)}
        >
          Start Run
        </button>

        <button
          disabled={!canStart}
          onClick={handleExport}
          style={exportBtnStyle(!canStart)}
        >
          Export run_config.json
        </button>

        {status === "sent" && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#5cb85c", textAlign: "center" }}>
            run_config.json written — ready for the game viewer.
          </div>
        )}
        {status === "error" && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#d9534f", textAlign: "center" }}>
            Failed — check project config or make sure Django is running.
          </div>
        )}
      </InspectorSection>
    </>
  );
}
