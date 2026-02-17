/**
 * Sidebar.jsx
 *
 * Main application sidebar navigation.
 *
 * Responsibilities:
 * - Renders primary app navigation links
 * - Serves as persistent left navigation for authenticated layouts
 *
 * This component is presentational and stateless.
 */

import { NavLink } from "react-router-dom";

/**
 * Navigation configuration.
 * Centralizing routes prevents duplication and improves maintainability.
 */
const NAV_ITEMS = [
  { label: "Home", path: "/dashboard" },
  { label: "Create", path: "/editor" },
  { label: "Test", path: "/test" },
  { label: "Play", path: "/play" },
];

/**
 * Sidebar
 *
 * Renders vertical navigation using NavLink
 * so active routes can be styled later.
 */
export default function Sidebar() {
  return (
    <nav
      style={{
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}