export default function OneColumnLayout({ header, children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div>{header}</div>
      <main style={{ flex: 1, padding: 16 }}>{children}</main>
    </div>
  );
}