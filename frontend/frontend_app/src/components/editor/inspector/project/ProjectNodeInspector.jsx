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

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProjectNodeInspector({ project, state, actions }) {
  const [hovered, setHovered] = useState(false);
  const [status, setStatus]   = useState(null); // null | "sent" | "error"

  const characters = (project.characterIds ?? [])
    .map((id) => state.project.characters.byId[id])
    .filter(Boolean);

  const firstChar = characters[0] ?? null;
  const hasDeck   = (firstChar?.startingDeck?.length ?? 0) > 0;
  const canStart  = !!firstChar && hasDeck;

  const hints = [];
  if (!firstChar) hints.push("Add at least one character");
  else if (!hasDeck) hints.push("Character needs a starting deck");

  function handleStartRun() {
    const payload = buildRunPayload(state, project.id);
    if (!payload) { setStatus("error"); return; }

    // TODO: POST payload to game state manager endpoint when ready
    console.log("[Start Run] Payload →", JSON.stringify(payload, null, 2));
    setStatus("sent");
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
            ["Cards in pool",   project.pools?.cards?.length    ?? 0],
            ["Relics in pool",  project.pools?.relics?.length   ?? 0],
            ["Potions in pool", project.pools?.potions?.length  ?? 0],
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

        {status === "sent" && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#5cb85c", textAlign: "center" }}>
            Payload logged — awaiting game state manager endpoint.
          </div>
        )}
        {status === "error" && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#d9534f", textAlign: "center" }}>
            Failed to build payload. Check project configuration.
          </div>
        )}
      </InspectorSection>
    </>
  );
}
