/**
 * useEditor.js
 *
 * Custom hook for accessing editor state and actions from EditorContext.
 *
 * Responsibility:
 * - Provides a single, consistent way to consume EditorContext.
 * - Enforces that the hook is only used inside <EditorProvider>.
 *
 * Usage:
 *   const { selected, updateSelected, ... } = useEditor();
 *
 * Why this exists:
 * - Prevents importing useContext(EditorContext) throughout the app.
 * - Centralizes the "must be inside provider" safety check.
 * - Makes future refactors (e.g., splitting context) easier.
 */

import { useContext } from "react";
import { EditorContext } from "@/state/editor/editorContext";

export function useEditor() {
  const ctx = useContext(EditorContext);

  // Enforce correct usage: this hook must be used inside EditorProvider
  if (!ctx) {
    throw new Error("useEditor must be used within EditorProvider");
  }

  return ctx;
}