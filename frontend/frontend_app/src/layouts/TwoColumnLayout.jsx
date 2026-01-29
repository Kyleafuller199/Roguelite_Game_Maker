export default function TwoColumnLayout({ header, left, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "0 0 auto" }}>{header}</div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
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

        <main style={{ flex: 1, padding: 16, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
