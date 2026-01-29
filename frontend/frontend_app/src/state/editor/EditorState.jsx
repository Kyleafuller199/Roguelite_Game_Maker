// src/state/editor/EditorState.jsx
import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect
  } from "react";
  
const EditorContext = createContext(null);
const STORAGE_KEY = "rgm_editor_state_v1";

const initialState = {
  mode: "assets",
  entityType: "card",
  selectedId: "card_basic_strike",
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
            return { ...prev, mode, entityType: "card", selectedId: prev.selectedId };
          }
          return { ...prev, mode, entityType: "character", selectedId: null };
        });
      },

      selectEntity(entityType, id) {
        setState((prev) => ({ ...prev, entityType, selectedId: id }));
      },

      createCard() {
        setState((prev) => {
          const id = `card_${Date.now()}`;

          const newCard = {
            id,
            name: "New Card",
            type: "Attack",
            rarity: "Common",
            cost: 1,
          };

          return {
            ...prev,
            mode: "assets",
            entityType: "card",
            selectedId: id,
            assets: {
              ...prev.assets,
              cards: {
                ...prev.assets.cards,
                byId: {
                  ...prev.assets.cards.byId,
                  [id]: newCard,
                },
                allIds: [id, ...prev.assets.cards.allIds],
              },
            },
          };
        });
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