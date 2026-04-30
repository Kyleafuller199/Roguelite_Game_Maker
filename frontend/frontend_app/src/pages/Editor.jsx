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

import { useState } from "react";

import ThreeColumnLayout from "@/layouts/ThreeColumnLayout";
import AppHeader from "@/components/AppHeader";
import Onboarding, { shouldShowOnboarding } from "@/components/Onboarding";

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
  // Show onboarding automatically on first visit; can be reopened via the ? button
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  return (
    <EditorProvider>
      {showOnboarding && (
        <Onboarding onClose={() => setShowOnboarding(false)} />
      )}

      <ThreeColumnLayout
        header={
          <AppHeader
            title="Editor"
            rightAction={
              <button
                onClick={() => setShowOnboarding(true)}
                title="Open guide"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 6, color: "#888",
                  width: 28, height: 28,
                  cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ?
              </button>
            }
          />
        }
        left={<EditorSidebar />}
        right={<EditorInspector />}
      >
        {/* Central working area */}
        <EditorCanvas />
      </ThreeColumnLayout>
    </EditorProvider>
  );
}