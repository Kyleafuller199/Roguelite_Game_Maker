/**
 * CollapsibleSection.jsx
 *
 * Reusable controlled collapsible section for the editor sidebar.
 *
 * Always controlled — the caller owns the open/closed state:
 * - Asset sidebar sections: local useState in the sidebar drives isOpen/onToggle
 * - Project sidebar tree nodes: EditorContext expanded state drives isOpen/onToggle
 *
 * @param {string}          title     - Section header label
 * @param {boolean}         isOpen    - Whether children are currently visible
 * @param {Function}        onToggle  - Called when the header row is clicked
 * @param {React.ReactNode} children  - Content shown when isOpen is true
 */
import {
  sectionHeader,
  sectionHeaderTitle,
  sectionHeaderChevron,
  sectionBody,
} from "@/components/editor/shared/sidebarStyles";

export default function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <div>

      {/* ── Header row ─────────────────────────────────────────── */}
      <div onClick={onToggle} style={sectionHeader}>
        <span style={sectionHeaderTitle}>{title}</span>
        <span style={sectionHeaderChevron}>{isOpen ? "▾" : "▸"}</span>
      </div>

      {/* ── Collapsible children ───────────────────────────────── */}
      {isOpen && (
        <div style={sectionBody}>
          {children}
        </div>
      )}

    </div>
  );
}
