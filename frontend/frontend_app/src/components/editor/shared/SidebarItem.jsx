/**
 * SidebarItem.jsx
 *
 * Reusable sidebar list item button.
 *
 * Used for:
 * - Asset mode: individual card/relic/potion/enemy entries
 * - Project mode: project tree leaf nodes (pool entries, character entries, etc.)
 *
 * @param {string}   label        - Display text for this item
 * @param {boolean}  selected     - Whether this item is the active selection
 * @param {Function} onClick      - Called when the item is clicked
 * @param {number}   [indent=0]   - Nesting depth; each level adds 12px of left padding
 */
import { useState } from "react";
import { sidebarButtonStyle } from "@/components/editor/shared/sidebarStyles";

export default function SidebarItem({ label, selected, onClick, indent = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        e.currentTarget.blur();
        onClick();
      }}
      style={{
        ...sidebarButtonStyle(selected, isHovered),
        paddingLeft: 0 + indent * 12,
      }}
    >
      {label}
    </button>
  );
}
