/**
 * NewAssetModal.jsx
 *
 * Small modal for creating a new asset.
 *
 * Prompts the user for:
 * - Asset type (Card, Relic, Potion, Enemy)
 * - Asset name (free-text input)
 *
 * Rendered via a React portal so it overlays the full viewport regardless of
 * the sidebar's overflow:hidden context.
 *
 * @param {boolean}  isOpen          - Controls visibility
 * @param {Function} onClose         - Called on Cancel or backdrop click
 * @param {{ card, relic, potion, enemy: Function }} onCreateByType
 *   Map of entity-type key → create action. Each function receives the
 *   trimmed name string (or undefined if the field was left blank).
 */

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
  COLOR_SELECTED_BG,
  COLOR_HOVER_BG,
  sidebarButtonStyle,
} from "@/components/editor/shared/sidebarStyles";

const ASSET_TYPES = [
  { key: "card",   label: "Card" },
  { key: "relic",  label: "Relic" },
  { key: "potion", label: "Potion" },
  { key: "enemy",  label: "Enemy" },
];

export default function NewAssetModal({ isOpen, onClose, onCreateByType }) {
  const [selectedType, setSelectedType] = useState("card");
  const [name, setName] = useState("");
  const [hoveredType, setHoveredType] = useState(null);

  if (!isOpen) return null;

  function handleCreate() {
    const createFn = onCreateByType[selectedType];
    if (createFn) createFn(name.trim() || undefined);
    // Reset and close
    setName("");
    setSelectedType("card");
    onClose();
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return createPortal(
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 300,
          backgroundColor: "#2a2a2a",
          borderRadius: 10,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          fontFamily: "'Inter', sans-serif",
        }}
      >

        {/* Title */}
        <span style={{ fontSize: 15, fontWeight: 600, color: COLOR_TEXT_MAIN }}>
          New Asset
        </span>

        {/* Asset type selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: COLOR_TEXT_SECONDARY, marginBottom: 2 }}>
            Type
          </span>
          {ASSET_TYPES.map(({ key, label }) => (
            <button
              key={key}
              onMouseEnter={() => setHoveredType(key)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => setSelectedType(key)}
              style={sidebarButtonStyle(selectedType === key, hoveredType === key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Name input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: COLOR_TEXT_SECONDARY }}>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            placeholder="Unnamed"
            autoFocus
            style={{
              height: 36,
              backgroundColor: "#1e1e1e",
              border: `1px solid ${COLOR_HOVER_BG}`,
              borderRadius: 6,
              padding: "0 10px",
              color: COLOR_TEXT_MAIN,
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              height: 34,
              padding: "0 14px",
              backgroundColor: "transparent",
              border: `1px solid ${COLOR_HOVER_BG}`,
              borderRadius: 6,
              color: COLOR_TEXT_SECONDARY,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            style={{
              height: 34,
              padding: "0 14px",
              backgroundColor: COLOR_SELECTED_BG,
              border: "none",
              borderRadius: 6,
              color: COLOR_TEXT_MAIN,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Create
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
