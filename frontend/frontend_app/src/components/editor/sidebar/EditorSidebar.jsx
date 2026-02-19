/**
 * EditorSidebar.jsx
 *
 * Left navigation panel for the Editor page.
 *
 * Responsibilities:
 * - Switches between editor modes ("assets" vs "project")
 * - Lists entities for the current mode
 * - Opens NewAssetModal to create new assets (centralized "+ New Asset" button)
 * - Allows selecting an entity to edit (drives canvas + inspector)
 *
 * Notes:
 * - UI-only; all editor state is owned by EditorContext (useEditor).
 * - Collapse state for asset sections is local — it's a pure UI preference
 *   with no semantic meaning to the editor. Project tree expansion state
 *   lives in EditorContext because it needs programmatic control.
 * - Scrolling: sticky top section always visible, scrollable list below.
 */

import { useMemo, useState } from "react";
import { useEditor } from "@/state/editor/useEditor";
import CollapsibleSection from "@/components/editor/shared/CollapsibleSection";
import SidebarItem from "@/components/editor/shared/SidebarItem";
import ProjectSidebar from "@/components/editor/sidebar/ProjectSidebar";
import NewAssetModal from "@/components/editor/sidebar/modal/NewAssetModal";
import {
  sidebarContainer,
  stickySection,
  toggleRow,
  sidebarButtonStyle,
  toggleButtonStyle,
} from "@/components/editor/shared/sidebarStyles";

/**
 * AssetSection
 *
 * One collapsible group for a single asset type (Cards, Relics, etc.).
 * Owns its own open/closed state via local useState.
 *
 * @param {string}          title               - Section heading
 * @param {string}          entityType          - Asset type key ("card" | "relic" | etc.)
 * @param {Array<object>}   items               - Resolved asset objects for this type
 * @param {string}          selectedEntityType  - Currently active entity type
 * @param {string|null}     selectedId          - Currently active entity id
 * @param {Function}        onSelect            - Selects an asset (entityType, id)
 * @param {Function}        [getItemLabel]      - Resolves display label from an item
 */
function AssetSection({
  title,
  entityType,
  items,
  selectedEntityType,
  selectedId,
  onSelect,
  getItemLabel,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <CollapsibleSection
      title={title}
      isOpen={isOpen}
      onToggle={() => setIsOpen((o) => !o)}
    >
      {items.map((item) => (
        <SidebarItem
          key={item.id}
          label={getItemLabel ? getItemLabel(item) : (item.name ?? "Unnamed")}
          selected={selectedEntityType === entityType && selectedId === item.id}
          onClick={() => onSelect(entityType, item.id)}
          indent={1}
        />
      ))}
    </CollapsibleSection>
  );
}

/**
 * EditorSidebar
 *
 * Renders the sticky top section (mode toggle + New Asset button) and the
 * scrollable list for whichever mode is active.
 */
export default function EditorSidebar() {
  const { state, actions } = useEditor();
  const isAssets = state.mode === "assets";

  // Hover tracking for sticky-section buttons
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // New Asset modal visibility
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Derive flat arrays from normalised state.
   * useMemo keeps list identity stable so AssetSection doesn't re-render
   * unless the relevant slice actually changed.
   */
  const cards = useMemo(
    () => state.assets.cards.allIds.map((id) => state.assets.cards.byId[id]),
    [state.assets.cards.allIds, state.assets.cards.byId]
  );
  const relics = useMemo(
    () => state.assets.relics.allIds.map((id) => state.assets.relics.byId[id]),
    [state.assets.relics.allIds, state.assets.relics.byId]
  );
  const potions = useMemo(
    () => state.assets.potions.allIds.map((id) => state.assets.potions.byId[id]),
    [state.assets.potions.allIds, state.assets.potions.byId]
  );
  const enemies = useMemo(
    () => state.assets.enemies.allIds.map((id) => state.assets.enemies.byId[id]),
    [state.assets.enemies.allIds, state.assets.enemies.byId]
  );

  return (
    <div style={sidebarContainer}>

      {/* ── Top sticky section ──────────────────────────────────── */}
      <div style={stickySection}>

        {/* Mode toggle — Assets | Projects */}
        <div style={toggleRow}>
          <button
            onClick={() => actions.setMode("assets")}
            onMouseEnter={() => setHoveredBtn("assets")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={toggleButtonStyle(isAssets, hoveredBtn === "assets")}
          >
            Assets
          </button>
          <button
            onClick={() => actions.setMode("project")}
            onMouseEnter={() => setHoveredBtn("project")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={toggleButtonStyle(!isAssets, hoveredBtn === "project")}
          >
            Projects
          </button>
        </div>

        {/* New Asset / New Project action */}
        <button
          onMouseEnter={() => setHoveredBtn("action")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => isAssets && setModalOpen(true)}
          style={sidebarButtonStyle(false, hoveredBtn === "action")}
        >
          {isAssets ? "+ New Asset" : "+ New Project"}
        </button>

      </div>

      {/* ── Scrollable content ──────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {isAssets ? (
          <>
            <AssetSection
              title="Cards"
              entityType="card"
              items={cards}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onSelect={actions.selectEntity}
              getItemLabel={(c) => c.name ?? "Unnamed Card"}
            />
            <AssetSection
              title="Relics"
              entityType="relic"
              items={relics}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onSelect={actions.selectEntity}
              getItemLabel={(r) => r.identity?.name ?? r.name ?? "Unnamed Relic"}
            />
            <AssetSection
              title="Potions"
              entityType="potion"
              items={potions}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onSelect={actions.selectEntity}
              getItemLabel={(p) => p.identity?.name ?? p.name ?? "Unnamed Potion"}
            />
            <AssetSection
              title="Enemies"
              entityType="enemy"
              items={enemies}
              selectedEntityType={state.entityType}
              selectedId={state.selectedId}
              onSelect={actions.selectEntity}
              getItemLabel={(e) => e.identity?.name ?? e.name ?? "Unnamed Enemy"}
            />
          </>
        ) : (
          <ProjectSidebar />
        )}
      </div>

      {/* ── New Asset modal (portal — renders outside sidebar overflow) ── */}
      <NewAssetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateByType={{
          card:   actions.createCard,
          relic:  actions.createRelic,
          potion: actions.createPotion,
          enemy:  actions.createEnemy,
        }}
      />

    </div>
  );
}
