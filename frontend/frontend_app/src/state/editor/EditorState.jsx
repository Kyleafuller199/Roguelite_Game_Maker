/**
 * EditorState.jsx
 * Owns global editor state + actions and exposes them via EditorContext.
 * Handles persistence and delegates asset-specific logic to /assets.
 */
import { useEffect, useMemo, useState } from "react";

import { initialState } from "@/state/editor/initialState";
import { EditorContext } from "@/state/editor/editorContext";

// Asset action delegates (kept separate for scalability)
import { createCard, updateSelectedCard } from "@/state/editor/assets/cards";
import { createRelic, updateSelectedRelic } from "@/state/editor/assets/relics";
import { createPotion, updateSelectedPotion } from "@/state/editor/assets/potions";
import { createEnemy, updateSelectedEnemy } from "@/state/editor/assets/enemies";

// localStorage key for editor persistence
const STORAGE_KEY = "rgm_editor_state_v2";

export function EditorProvider({ children }) {
  // Initialize state from localStorage (fallback to defaults)
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;
      return { ...initialState, ...JSON.parse(raw) };
    } catch {
      return initialState;
    }
  });

  // Persist editor state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore persistence errors
    }
  }, [state]);

  // Editor actions (memoized to keep stable references)
  const actions = useMemo(
    () => ({
      // Switch editor mode and adjust selection defaults
      setMode(mode) {
        setState((prev) =>
          mode === "assets"
            ? { ...prev, mode, entityType: "card", selectedId: prev.selectedId }
            : { ...prev, mode, entityType: "character", selectedId: null }
        );
      },

      // Select an entity for inspection/editing
      selectEntity(entityType, id) {
        setState((prev) => ({ ...prev, entityType, selectedId: id }));
      },

      // Asset actions (delegated)
      createCard() { createCard(setState); },
      updateSelectedCard(patch) { updateSelectedCard(setState, patch); },

      createRelic() { createRelic(setState); },
      updateSelectedRelic(patch) { updateSelectedRelic(setState, patch); },

      createPotion() { createPotion(setState); },
      updateSelectedPotion(patch) { updateSelectedPotion(setState, patch); },

      createEnemy() { createEnemy(setState); },
      updateSelectedEnemy(patch) { updateSelectedEnemy(setState, patch); },
    }),
    []
  );

  // Context value
  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}