/**
 * CanvasSection.jsx
 *
 * Shared reusable section component for all canvas preview surfaces.
 * Provides a consistently styled header (14px semibold, primary colour)
 * with children rendered in a 13px body below.
 */

import { canvasSectionTitle, canvasBodyText } from "./canvasStyles";

export default function CanvasSection({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={canvasSectionTitle}>{title}</div>
      <div style={canvasBodyText}>{children}</div>
    </div>
  );
}
