/**
 * OneColumnLayout.jsx
 *
 * Generic single-column layout.
 *
 * Responsibilities:
 * - Provides full-height page structure
 * - Renders an optional header section
 * - Renders main content area
 */

 /**
  * OneColumnLayout
  *
  * @param {ReactNode} header - Optional header component rendered at the top
  * @param {ReactNode} children - Page content
  *
  * Creates a vertical layout with:
  * - Header (fixed at top)
  * - Flexible main content area
  */
export default function OneColumnLayout({ header, children }) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column" 
      }}
    >
      {/* Header section */}
      {header && <div>{header}</div>}

      {/* Main content area fills remaining vertical space */}
      <main style={{ flex: 1, padding: 16 }}>
        {children}
      </main>
    </div>
  );
}