import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ padding: 12 }}>
      <div><Link to="/dashboard">Home</Link></div>
      <div><Link to="/editor">Create</Link></div>
      <div><Link to="/test">Test</Link></div>
      <div><Link to="/play">Play</Link></div>
    </div>
  );
}