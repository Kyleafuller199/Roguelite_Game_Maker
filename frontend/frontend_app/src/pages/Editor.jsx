// src/pages/Editor.jsx
import ThreeColumnLayout from "@/layouts/ThreeColumnLayout";
import AppHeader from "@/components/AppHeader";

import { EditorProvider } from "@/state/editor/EditorState";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorInspector from "@/components/editor/inspector/EditorInspector";
import EditorCanvas from "@/components/editor/canvas/EditorCanvas";

export default function Editor() {
  return (
    <EditorProvider>
      <ThreeColumnLayout
        header={<AppHeader title="Editor" />}
        left={<EditorSidebar />}
        right={<EditorInspector />}
      >
        <EditorCanvas />
      </ThreeColumnLayout>
    </EditorProvider>
  );
}
