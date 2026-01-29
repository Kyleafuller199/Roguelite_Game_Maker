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
      <div style={{ flex: "0 0 auto" }}>{header}</div>

      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0,
        }}
      >
        {/* LEFT / Editor Sidebar */}
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

        {/* CENTER */}
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

        {/* RIGHT / Inspector */}
        <aside
          style={{
            width: 260,
            flexShrink: 0,
            boxSizing: "border-box",
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
