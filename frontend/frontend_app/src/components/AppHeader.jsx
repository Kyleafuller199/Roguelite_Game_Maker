import { Link } from "react-router-dom";

export default function AppHeader({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      <strong>{title}</strong>

      <nav
        style={{
          display: "flex",
          gap: 12,
          marginLeft: "auto",
        }}
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/editor">Editor</Link>
        <Link to="/test">Test</Link>
        <Link to="/play">Play</Link>
      </nav>
    </div>
  );
}
