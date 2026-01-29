// src/state/editor/EditorState.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

import { initialState } from "./InitialState";

import { createCard, updateSelectedCard } from "./assets/cards";
import { createRelic, updateSelectedRelic } from "./assets/relics";
import { createPotion, updateSelectedPotion } from "./assets/potions";
import { createEnemy, updateSelectedEnemy } from "./assets/enemies";


const EditorContext = createContext(null);
const STORAGE_KEY = "rgm_editor_state_v2";

export function EditorProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;

      const parsed = JSON.parse(raw);
      return { ...initialState, ...parsed };
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota or serialization errors
    }
  }, [state]);

  const actions = useMemo(() => {
    return {
      setMode(mode) {
        setState((prev) => {
          if (mode === "assets") {
            return {
              ...prev,
              mode,
              entityType: "card",
              selectedId: prev.selectedId, // keep current selection (ok for now)
            };
          }
          return { ...prev, mode, entityType: "character", selectedId: null };
        });
      },

      selectEntity(entityType, id) {
        setState((prev) => ({ ...prev, entityType, selectedId: id }));
      },

      // Asset actions (delegated)
      createCard() {
        createCard(setState);
      },

      updateSelectedCard(patch) {
        updateSelectedCard(setState, patch);
      },

      createRelic() { 
        createRelic(setState); 
      },

      updateSelectedRelic(patch) {
        updateSelectedRelic(setState, patch); 
      },

      createPotion() { 
        createPotion(setState); 
      },

      updateSelectedPotion(patch) { 
        updateSelectedPotion(setState, patch); 
      },

      createEnemy() { 
        createEnemy(setState); 
      },

      updateSelectedEnemy(patch) { 
        updateSelectedEnemy(setState, patch); 
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