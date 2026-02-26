/**
 * PoolRow.jsx
 *
 * Reusable toggle row for pool inspector lists.
 * Clicking the row calls onToggle to add or remove the asset from a pool.
 *
 * @param {string}   label    - Asset display name
 * @param {boolean}  inPool   - Whether this asset is currently in the pool
 * @param {Function} onToggle - Called on click to toggle membership
 */

import { useState } from "react";
import {
  COLOR_TEXT_MAIN,
  COLOR_TEXT_SECONDARY,
} from "@/components/editor/shared/sidebarStyles";

export default function PoolRow({ label, inPool, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7px 12px",
        cursor: "pointer",
        backgroundColor: inPool
          ? "rgba(255,255,255,0.06)"
          : hovered ? "rgba(255,255,255,0.03)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span style={{ fontSize: 13, color: inPool ? COLOR_TEXT_MAIN : COLOR_TEXT_SECONDARY }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          color: inPool ? "#5a9a5a" : COLOR_TEXT_SECONDARY,
          fontWeight: 700,
          minWidth: 16,
          textAlign: "center",
        }}
      >
        {inPool ? "✓" : "+"}
      </span>
    </div>
  );
}
