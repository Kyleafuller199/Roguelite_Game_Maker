/**
 * TwoColumnLayout.jsx
 *
 * Generic two-column application layout.
 *
 * Responsibilities:
 * - Renders a header at the top
 * - Renders a fixed-width left sidebar
 * - Renders a flexible main content area
 *
 * Intended for authenticated app views (e.g., Dashboard, Test).
 */

 /**
  * TwoColumnLayout
  *
  * @param {ReactNode} header - Top header component
  * @param {ReactNode} left - Left sidebar content
  * @param {ReactNode} children - Main content area
  */
 export default function TwoColumnLayout({ header, left, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      {header && <div style={{ flex: "0 0 auto" }}>{header}</div>}

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0, // Required for proper overflow behavior
        }}
      >
        {/* Left Sidebar */}
        {left && (
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              boxSizing: "border-box",
              padding: 12,
              borderRight: "1px solid #ddd",
              overflow: "hidden",
            }}
          >
            {left}
          </aside>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: 16,
            minWidth: 0, // Prevents overflow issues with flexbox
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}