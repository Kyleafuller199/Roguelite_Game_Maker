/**
 * useEditor.js
 * Convenience hook for accessing editor state + actions.
 * Enforces usage within EditorProvider.
 */
import { useContext } from "react";
import { EditorContext } from "@/state/editor/editorContext";

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return ctx;
}