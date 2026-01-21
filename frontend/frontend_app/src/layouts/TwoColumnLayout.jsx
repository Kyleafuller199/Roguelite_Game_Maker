export default function TwoColumnLayout({ header, left, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div>{header}</div>

      <div style={{ flex: 1, display: "flex" }}>
        <aside style={{ width: 220, padding: 12, borderRight: "1px solid #ddd" }}>
          {left}
        </aside>

        <main style={{ flex: 1, padding: 16 }}>{children}</main>
      </div>

    </div>
  );
}
