export default function ThreeColumnLayout({ header, left, right, children }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // stops the whole page scrolling
      }}
    >
      <div style={{ flex: "0 0 auto" }}>{header}</div>

      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0, // IMPORTANT: enables child scroll areas in flex layouts
        }}
      >
        <aside
          style={{
            width: 220,
            borderRight: "1px solid #ddd",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {left}
        </aside>

        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: 16,
          }}
        >
          {children}
        </main>

        <aside
          style={{
            width: 260,
            borderLeft: "1px solid #ddd",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {right}
        </aside>
      </div>
    </div>
  );
}
