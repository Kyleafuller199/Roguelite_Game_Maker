/**
 * EditorState.jsx
 *
 * Owns global editor state and exposes it through EditorContext.
 *
 * Responsibilities:
 * - Initialize editor state (localStorage → fallback to initialState)
 * - Persist state changes to localStorage
 * - Provide stable editor actions for UI components to call
 * - Delegate asset-specific CRUD logic to /state/editor/assets/*
 * - Delegate project-specific logic to /state/editor/project/*
 *
 * Data Model:
 * - state.mode controls which UI/selection logic is active ("assets" | "project")
 * - Asset editing uses (entityType, selectedId)
 * - Project composition uses project.selectedNode + project.expanded
 *
 * Persistence:
 * - Uses localStorage as a simple client-side persistence layer.
 * - Backend persistence can later replace/augment this behavior.
 */

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { initialState } from "@/state/editor/initialState";
import { EditorContext } from "@/state/editor/editorContext";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
const SESSION_LS_KEY = "rgm_session_key";

function getSessionKey() {
  let key = localStorage.getItem(SESSION_LS_KEY);
  if (!key) {
    key = uuidv4();
    localStorage.setItem(SESSION_LS_KEY, key);
  }
  return key;
}

// Asset action delegates (kept separate for scalability)
import { createCard, updateSelectedCard, deleteSelectedCard } from "@/state/editor/assets/cards";
import { createRelic, updateSelectedRelic, deleteSelectedRelic } from "@/state/editor/assets/relics";
import { createPotion, updateSelectedPotion, deleteSelectedPotion } from "@/state/editor/assets/potions";
import { createEnemy, updateSelectedEnemy, deleteSelectedEnemy } from "@/state/editor/assets/enemies";

// Project action delegates
import {
  createProject,
  deleteProject,
  updateProject,
  createCharacter,
  deleteCharacter,
  updateCharacter,
  setCharacterStartingRelic,
  toggleCharacterDeckCard,
  setCharacterDeckCardCount,
  toggleCharacterPoolAsset,
  togglePoolAsset,
  toggleActEnemy,
} from "@/state/editor/project/projects";

// localStorage key for editor persistence
const STORAGE_KEY = "rgm_editor_state_v4";

export function EditorProvider({ children }) {
  /**
   * State initialization:
   * - Attempt to read and parse localStorage
   * - Merge parsed values into initialState so missing keys get defaults
   * - If parsing fails, fall back to initialState
   */
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;

      const parsed = JSON.parse(raw);

      // Shallow merge top-level + explicit merges for nested branches
      // so schema additions continue to get defaults.
      return {
        ...initialState,
        ...parsed,
        assets: { ...initialState.assets, ...(parsed.assets ?? {}) },
        project: { ...initialState.project, ...(parsed.project ?? {}) },
      };
    } catch {
      return initialState;
    }
  });

  /**
   * Persistence: localStorage (fast, immediate)
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore persistence errors (e.g., storage quota exceeded)
    }
  }, [state]);

  /**
   * Persistence: backend (on mount, load saved state from server)
   * Falls back silently to whatever localStorage already provided.
   */
  useEffect(() => {
    fetch(`${API_BASE}/api/state/?session=${getSessionKey()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.state) {
          setState({
            ...initialState,
            ...data.state,
            assets: { ...initialState.assets, ...(data.state.assets ?? {}) },
            project: { ...initialState.project, ...(data.state.project ?? {}) },
          });
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Persistence: backend (debounced save on every state change)
   */
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/state/?session=${getSessionKey()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).catch(() => {});
    }, 1000);
    return () => clearTimeout(t);
  }, [state]);

  /**
   * Editor actions:
   * - Memoized to keep stable references (prevents unnecessary rerenders)
   * - Each action uses setState(prev => next) for safe updates
   * - Asset and project CRUD are delegated to their respective modules
   *
   * Note:
   * - setState is stable in React, so empty deps is fine here.
   * - Delegated functions must rely on the provided setState callback.
   */
  const actions = useMemo(
    () => ({
      /**
       * setMode
       * Switch between "assets" and "project" editor modes.
       *
       * Behavior:
       * - assets mode: only updates mode
       * - project mode: ensures a valid selectedNode exists
       */
      setMode(mode) {
        setState((prev) => {
          if (mode === "assets") {
            return { ...prev, mode: "assets" };
          }

          // project mode: attempt to select first project if none selected yet
          const firstProjectId = prev.project?.projects?.allIds?.[0] ?? null;

          return {
            ...prev,
            mode: "project",
            project: {
              ...prev.project,
              selectedNode:
                prev.project?.selectedNode ??
                (firstProjectId ? { kind: "project", projectId: firstProjectId } : null),
            },
          };
        });
      },

      /**
       * selectEntity
       * Asset-mode selection only.
       * Stores the currently selected asset type and id.
       */
      selectEntity(entityType, id) {
        setState((prev) => ({ ...prev, entityType, selectedId: id }));
      },

      // -------------------------------------------------
      // Project-mode navigation actions (simple enough to stay inline)
      // -------------------------------------------------

      /** Sets the active node selection for the project tree. */
      selectProjectNode(node) {
        setState((prev) => ({
          ...prev,
          project: { ...prev.project, selectedNode: node },
        }));
      },

      /** Toggles a tree expansion key in the project sidebar. */
      toggleProjectExpanded(key) {
        setState((prev) => ({
          ...prev,
          project: {
            ...prev.project,
            expanded: {
              ...prev.project.expanded,
              [key]: !prev.project.expanded[key],
            },
          },
        }));
      },

      // -------------------------------------------------
      // Project actions (delegated to /project module)
      // -------------------------------------------------

      /** Projects */
      createProject(name)                                      { createProject(setState, name); },
      deleteProject(projectId)                                 { deleteProject(setState, projectId); },
      updateProject(projectId, patch)                          { updateProject(setState, projectId, patch); },
      createCharacter(projectId, name)                         { createCharacter(setState, projectId, name); },
      deleteCharacter(projectId, characterId)                  { deleteCharacter(setState, projectId, characterId); },
      togglePoolAsset(projectId, poolType, id)                 { togglePoolAsset(setState, projectId, poolType, id); },
      toggleActEnemy(projectId, act, role, id)                 { toggleActEnemy(setState, projectId, act, role, id); },

      /** Characters */
      updateCharacter(characterId, patch)                      { updateCharacter(setState, characterId, patch); },
      setCharacterStartingRelic(characterId, relicId)          { setCharacterStartingRelic(setState, characterId, relicId); },
      toggleCharacterDeckCard(characterId, cardId)             { toggleCharacterDeckCard(setState, characterId, cardId); },
      setCharacterDeckCardCount(characterId, cardId, count)    { setCharacterDeckCardCount(setState, characterId, cardId, count); },
      toggleCharacterPoolAsset(characterId, poolType, id)      { toggleCharacterPoolAsset(setState, characterId, poolType, id); },

      // -------------------------------------------------
      // Asset actions (delegated to /assets modules)
      // -------------------------------------------------

      /** Cards */
      createCard(name)              { createCard(setState, name); },
      updateSelectedCard(patch)     { updateSelectedCard(setState, patch); },
      deleteSelectedCard()          { deleteSelectedCard(setState); },

      /** Relics */
      createRelic(name)             { createRelic(setState, name); },
      updateSelectedRelic(patch)    { updateSelectedRelic(setState, patch); },
      deleteSelectedRelic()         { deleteSelectedRelic(setState); },

      /** Potions */
      createPotion(name)            { createPotion(setState, name); },
      updateSelectedPotion(patch)   { updateSelectedPotion(setState, patch); },
      deleteSelectedPotion()        { deleteSelectedPotion(setState); },

      /** Enemies */
      createEnemy(name)             { createEnemy(setState, name); },
      updateSelectedEnemy(patch)    { updateSelectedEnemy(setState, patch); },
      deleteSelectedEnemy()         { deleteSelectedEnemy(setState); },
    }),
    []
  );

  /**
   * Context value:
   * - state changes frequently
   * - actions are stable (memoized once)
   */
  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
