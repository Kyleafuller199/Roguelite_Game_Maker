/**
 * editorContext.js
 * Shared React context for editor state + actions.
 * Used by EditorProvider and consumed via useEditor().
 */
import { createContext } from "react";

// Value shape: { state, actions }
export const EditorContext = createContext(null);