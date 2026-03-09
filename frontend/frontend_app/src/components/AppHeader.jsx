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
 * @param {string} title - Title displayed on the left side of the header
 */
export default function AppHeader({ title }) {
  return (
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          margin: 0,
        }}
      >
        {title}
      </h1>

      <nav
        style={{
          display: "flex",
          gap: 12,
          marginLeft: "auto",
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
    </div>
  );
}