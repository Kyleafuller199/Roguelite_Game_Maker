/**
 * EditorState.jsx
 *
 * Owns global editor state and exposes it through EditorContext.
 *
 * Responsibilities:
 * - Initialize editor state (localStorage → fallback to initialState)
 * - Persist state changes to localStorage (V1 persistence)
 * - Provide stable editor actions for UI components to call
 * - Delegate asset-specific CRUD logic to /state/editor/assets/*
 * - Delegate project-specific logic to /state/editor/project/*
 *
 * Data Model:
 * - state.mode controls which UI/selection logic is active ("assets" | "project")
 * - Asset editing uses (entityType, selectedId)
 * - Project composition uses project.selectedNode + project.expanded
 *
 * Persistence (V1):
 * - Uses localStorage as a simple client-side persistence layer.
 * - Backend persistence can later replace/augment this behavior.
 */

import { useEffect, useMemo, useState } from "react";

import { initialState } from "@/state/editor/initialState";
import { EditorContext } from "@/state/editor/editorContext";

// Asset action delegates (kept separate for scalability)
import { createCard, updateSelectedCard, deleteSelectedCard } from "@/state/editor/assets/cards";
import { createRelic, updateSelectedRelic, deleteSelectedRelic } from "@/state/editor/assets/relics";
import { createPotion, updateSelectedPotion, deleteSelectedPotion } from "@/state/editor/assets/potions";
import { createEnemy, updateSelectedEnemy, deleteSelectedEnemy } from "@/state/editor/assets/enemies";

// Project action delegates
import {
  createProject,
  createCharacter,
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
   * Persistence:
   * - Save the entire editor state on any change.
   * - If localStorage errors (quota, privacy mode), silently ignore.
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore persistence errors (e.g., storage quota exceeded)
    }
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
      createProject(name)                        { createProject(setState, name); },
      createCharacter(projectId, name)           { createCharacter(setState, projectId, name); },
      togglePoolAsset(projectId, poolType, id)   { togglePoolAsset(setState, projectId, poolType, id); },
      toggleActEnemy(projectId, act, role, id)   { toggleActEnemy(setState, projectId, act, role, id); },

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
