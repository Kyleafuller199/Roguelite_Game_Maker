/**
 * ThreeColumnLayout.jsx
 *
 * Core editor layout.
 *
 * Responsibilities:
 * - Renders a header
 * - Provides fixed-width left sidebar
 * - Provides scrollable center canvas area
 * - Provides fixed-width right inspector panel
 *
 * Designed specifically for the Editor page.
 */

 /**
  * ThreeColumnLayout
  *
  * @param {ReactNode} header - Top header component
  * @param {ReactNode} left - Left sidebar content
  * @param {ReactNode} right - Right inspector content
  * @param {ReactNode} children - Center canvas content
  */
 export default function ThreeColumnLayout({ header, left, right, children }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      {header && <div style={{ flex: "0 0 auto" }}>{header}</div>}

      {/* Main Editor Surface */}
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0,
        }}
      >
        {/* Left Sidebar */}
        {left && (
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              boxSizing: "border-box",
              borderRight: "1px solid #ddd",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {left}
          </aside>
        )}

        {/* Center Canvas Area */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto", // Enables scrolling in center panel
            padding: 16,
          }}
        >
          {children}
        </main>

        {/* Right Inspector */}
        {right && (
          <aside
            style={{
              width: 360,
              flexShrink: 0,
              boxSizing: "border-box",
              borderLeft: "1px solid #ddd",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {right}
          </aside>
        )}
      </div>
    </div>
  );
}