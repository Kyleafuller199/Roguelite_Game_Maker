/**
 * AppHeader.jsx
 *
 * Primary application header used for authenticated pages.
 *
 * Responsibilities:
 * - Displays current page title
 * - Provides top-level navigation links
 * - Acts as the main app navigation bar
 */

import { NavLink } from "react-router-dom";

/**
 * Centralized navigation configuration.
 * Shared structure should match Sidebar navigation.
 */
const NAV_ITEMS = [
//  { label: "Dashboard", path: "/dashboard" },
//  { label: "Editor", path: "/editor" },
// { label: "Test", path: "/test" },
//  { label: "Play", path: "/play" },
];

/**
 * AppHeader
 *
 * @param {string}    title       - Title displayed on the left side of the header
 * @param {ReactNode} rightAction - Optional element rendered to the right of nav items
 */
export default function AppHeader({ title, rightAction }) {
  return (
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        boxSizing: "border-box",
        backgroundColor: "#383838",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          margin: 0,
          color: "#ffffff",
        }}
      >
        {title}
      </h1>

      <nav
        style={{
          display: "flex",
          gap: 12,
          marginLeft: "auto",
          alignItems: "center",
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
        {rightAction}
      </nav>
    </div>
  );
}