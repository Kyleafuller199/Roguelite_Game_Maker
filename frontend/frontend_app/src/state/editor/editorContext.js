/**
 * editorContext.js
 *
 * Defines the shared React context used for global editor state
 * and editor actions.
 *
 * This context is:
 * - Created here
 * - Provided by <EditorProvider>
 * - Consumed via the useEditor() hook
 *
 * Value Shape (provided by EditorProvider):
 * {
 *   state: { ...editorState },
 *   actions: { ...editorActions }
 * }
 *
 * Notes:
 * - Default value is `null` to enforce proper usage.
 * - useEditor() throws if accessed outside EditorProvider.
 */

import { createContext } from "react";

// Context is intentionally initialized as null.
// Consumers must be wrapped in <EditorProvider>.
export const EditorContext = createContext(null);