/**
 * InspectorSection.jsx
 *
 * Shared collapsible section component for all inspector panels.
 *
 * Mirrors the CollapsibleSection used in the sidebar — same header/body styles
 * from sidebarStyles — but manages its own open/closed state so each section
 * is self-contained. Callers only need to supply a title and children.
 *
 * Supports an optional `action` prop: a React node (e.g. an "Add" button)
 * rendered to the left of the collapse chevron. Clicks on the action are
 * stopped from propagating so they don't toggle the section.
 *
 * @param {string}          title         - Section header label
 * @param {React.ReactNode} [action]      - Optional action element in the header
 * @param {React.ReactNode} children      - Form content shown when open
 * @param {boolean}         [defaultOpen] - Initial open state (default: true)
 */

import { useState } from "react";
import {
  sectionHeader,
  sectionHeaderTitle,
  sectionHeaderChevron,
  sectionBody,
} from "@/components/editor/shared/sidebarStyles";

/** sectionBody with gap removed — inspector form fields carry their own margins. */
const inspectorBodyStyle = { ...sectionBody, gap: 0 };

export default function InspectorSection({ title, action, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      {/* ── Header row ──────────────────────────────────────────── */}
      <div onClick={() => setIsOpen((o) => !o)} style={sectionHeader}>
        <span style={sectionHeaderTitle}>{title}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {action && (
            <span onClick={(e) => e.stopPropagation()}>
              {action}
            </span>
          )}
          <span style={sectionHeaderChevron}>{isOpen ? "▾" : "▸"}</span>
        </div>
      </div>

      {/* ── Collapsible body ────────────────────────────────────── */}
      {isOpen && <div style={inspectorBodyStyle}>{children}</div>}
    </div>
  );
}
