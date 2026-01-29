// src/state/editor/EditorState.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const EditorContext = createContext(null);

const initialState = {
  mode: "assets", // "assets" | "projects"
  entityType: "card", // "card" | "relic" | "potion" | "enemy" | "globalPool" | "character"
  selectedId: "card_basic_strike",

  // Minimal data for the first loop
  assets: {
    cards: {
      byId: {
        card_basic_strike: {
          id: "card_basic_strike",
          name: "Basic Strike",
          type: "Attack",
          rarity: "Common",
          cost: 1,
        },
        card_2: {
          id: "card_2",
          name: "Card 2",
          type: "Skill",
          rarity: "Common",
          cost: 1,
        },
      },
      allIds: ["card_basic_strike", "card_2"],
    },
  },

  projects: {
    globalPools: { byId: {}, allIds: [] },
    characters: { byId: {}, allIds: [] },
  },
};

export function EditorProvider({ children }) {
  const [state, setState] = useState(initialState);

  const actions = useMemo(() => {
    return {
      setMode(mode) {
        setState((prev) => {
          // Keep selection valid when switching modes
          if (mode === "assets") {
            return { ...prev, mode, entityType: "card", selectedId: prev.selectedId };
          }
          return { ...prev, mode, entityType: "character", selectedId: null };
        });
      },

      selectEntity(entityType, id) {
        setState((prev) => ({ ...prev, entityType, selectedId: id }));
      },

      updateSelectedCard(patch) {
        setState((prev) => {
          if (prev.mode !== "assets" || prev.entityType !== "card" || !prev.selectedId) return prev;
          const id = prev.selectedId;
          const current = prev.assets.cards.byId[id];
          if (!current) return prev;

          return {
            ...prev,
            assets: {
              ...prev.assets,
              cards: {
                ...prev.assets.cards,
                byId: {
                  ...prev.assets.cards.byId,
                  [id]: { ...current, ...patch },
                },
              },
            },
          };
        });
      },
    };
  }, []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
