/**
 * Editor.jsx
 *
 * Core editor page of the application.
 *
 * Responsibilities:
 * - Wraps the editor in its state provider (EditorProvider)
 * - Composes the three-column editor layout
 * - Injects sidebar, canvas, and inspector regions
 *
 * This page defines the structural contract of the editor:
 *   Left  → Asset / project navigation
 *   Center → Canvas / working area
 *   Right → Inspector panel
 */

import ThreeColumnLayout from "@/layouts/ThreeColumnLayout";
import AppHeader from "@/components/AppHeader";

import { EditorProvider } from "@/state/editor/EditorState";
import EditorSidebar from "@/components/editor/sidebar/EditorSidebar";
import EditorInspector from "@/components/editor/inspector/EditorInspector";
import EditorCanvas from "@/components/editor/canvas/EditorCanvas";

/**
 * Editor
 *
 * Routed at "/editor".
 *
 * The EditorProvider wraps the entire layout so that
 * all editor subcomponents (sidebar, canvas, inspector)
 * share the same editor state context.
 */
export default function Editor() {
  return (
    <EditorProvider>
      <ThreeColumnLayout
        header={<AppHeader title="Editor" />}
        left={<EditorSidebar />}
        right={<EditorInspector />}
      >
        {/* Central working area */}
        <EditorCanvas />
      </ThreeColumnLayout>
    </EditorProvider>
  );
}