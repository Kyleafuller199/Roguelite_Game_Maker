export default function ThreeColumnLayout({ header, left, right, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "0 0 auto" }}>{header}</div>

      <div style={{ flex: "1 1 auto", display: "flex" }}>
        <aside style={{ width: 220, padding: 12, borderRight: "1px solid #ddd" }}>
          {left}
        </aside>

        <main style={{ flex: 1, padding: 16 }}>
          {children}
        </main>

        <aside style={{ width: 260, padding: 12, borderLeft: "1px solid #ddd" }}>
          {right}
        </aside>
      </div>
      
    </div>
  );
}
