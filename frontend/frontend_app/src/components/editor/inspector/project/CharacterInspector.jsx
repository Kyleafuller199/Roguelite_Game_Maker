/**
 * CharacterInspector.jsx
 *
 * Inspector shown when a character node is selected in the project tree.
 *
 * Sections:
 * - Identity      — editable character name
 * - Starting Relic — pick one relic from the project's relic pool (or none)
 * - Starting Deck  — toggle cards from the project's card pool; set per-card count
 *
 * All selectable assets are drawn from the parent project's pools so only
 * assets the designer has already approved appear here.
 *
 * @param {object}   character - The character object being inspected
 * @param {object}   project   - The owning project (for pool access)
 * @param {object}   state     - Full editor state (global asset byId maps)
 * @param {object}   actions   - Editor actions
 */

import InspectorSection from "@/components/editor/inspector/shared/InspectorSection";
import PoolRow from "@/components/editor/inspector/project/PoolRow";
import Label from "@/components/editor/inspector/shared/Label";
import {
  COLOR_TEXT_SECONDARY,
  COLOR_TEXT_MAIN,
} from "@/components/editor/shared/sidebarStyles";

// ── Styles ────────────────────────────────────────────────────────────────────

const emptyHint = { padding: "8px 12px", fontSize: 13, color: COLOR_TEXT_SECONDARY };

const countRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "7px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  backgroundColor: "rgba(255,255,255,0.06)",
};

const countInput = {
  width: 48,
  textAlign: "center",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 4,
  color: COLOR_TEXT_MAIN,
  fontSize: 13,
  padding: "2px 4px",
};

// ── Sub-sections ──────────────────────────────────────────────────────────────

/**
 * RelicSelector
 * Shows all relics in the project pool.
 * Exactly one can be selected as the starting relic; clicking again deselects.
 */
function RelicSelector({ character, project, state, actions }) {
  const poolRelicIds = project.pools?.relics ?? [];

  if (poolRelicIds.length === 0) {
    return (
      <div style={emptyHint}>
        No relics in the project pool yet. Add relics via the Relic Pool inspector.
      </div>
    );
  }

  const relics = poolRelicIds
    .map((id) => state.assets.relics.byId[id])
    .filter(Boolean);

  function handleToggle(relicId) {
    const next = character.startingRelicId === relicId ? null : relicId;
    actions.setCharacterStartingRelic(character.id, next);
  }

  return (
    <div>
      {relics.map((relic) => (
        <PoolRow
          key={relic.id}
          label={relic.identity?.name ?? "Unnamed Relic"}
          inPool={character.startingRelicId === relic.id}
          onToggle={() => handleToggle(relic.id)}
        />
      ))}
    </div>
  );
}

/**
 * DeckBuilder
 * Shows all cards in the project pool.
 * Cards already in the starting deck show a count stepper.
 * Cards not in the deck show a "+" toggle row to add them (with count 1).
 */
function DeckBuilder({ character, project, state, actions }) {
  const poolCardIds = project.pools?.cards ?? [];

  if (poolCardIds.length === 0) {
    return (
      <div style={emptyHint}>
        No cards in the project pool yet. Add cards via the Card Pool inspector.
      </div>
    );
  }

  const cards = poolCardIds
    .map((id) => state.assets.cards.byId[id])
    .filter(Boolean);

  const deckMap = Object.fromEntries(
    (character.startingDeck ?? []).map((e) => [e.cardId, e.count])
  );

  return (
    <div>
      {cards.map((card) => {
        const inDeck = card.id in deckMap;
        const count  = deckMap[card.id] ?? 1;

        if (inDeck) {
          return (
            <div key={card.id} style={countRow}>
              <span style={{ fontSize: 13, color: COLOR_TEXT_MAIN }}>{card.name ?? "Unnamed Card"}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={count}
                  onChange={(e) =>
                    actions.setCharacterDeckCardCount(character.id, card.id, Number(e.target.value))
                  }
                  style={countInput}
                />
                <span
                  onClick={() => actions.toggleCharacterDeckCard(character.id, card.id)}
                  title="Remove from deck"
                  style={{ cursor: "pointer", fontSize: 16, color: COLOR_TEXT_SECONDARY, lineHeight: 1 }}
                >
                  ✕
                </span>
              </div>
            </div>
          );
        }

        return (
          <PoolRow
            key={card.id}
            label={card.name ?? "Unnamed Card"}
            inPool={false}
            onToggle={() => actions.toggleCharacterDeckCard(character.id, card.id)}
          />
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CharacterInspector({ character, project, state, actions }) {
  return (
    <>
      {/* ── Identity ──────────────────────────────────────────── */}
      <InspectorSection title="Identity">
        <Label>Name</Label>
        <input
          value={character.name ?? ""}
          onChange={(e) => actions.updateCharacter(character.id, { name: e.target.value })}
          placeholder="Character name"
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />
      </InspectorSection>

      {/* ── Starting Relic ────────────────────────────────────── */}
      <InspectorSection title="Starting Relic">
        <RelicSelector
          character={character}
          project={project}
          state={state}
          actions={actions}
        />
      </InspectorSection>

      {/* ── Starting Deck ─────────────────────────────────────── */}
      <InspectorSection title="Starting Deck">
        <DeckBuilder
          character={character}
          project={project}
          state={state}
          actions={actions}
        />
      </InspectorSection>
    </>
  );
}
