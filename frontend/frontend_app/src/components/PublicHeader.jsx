/**
 * PublicHeader.jsx
 *
 * Header used for public-facing pages (landing, auth).
 *
 * Responsibilities:
 * - Displays optional left action (e.g., Back link)
 * - Displays page title
 * - Displays optional right-side actions
 */

 /**
  * PublicHeader
  *
  * @param {string} title - Header title text
  * @param {ReactNode} leftAction - Optional left-side element (e.g., Back link)
  * @param {ReactNode} rightAction - Optional right-side element (e.g., Login links)
  */
 export default function PublicHeader({ title, leftAction, rightAction }) {
  return (
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      {/* Left Action (Back, etc.) */}
      <div style={{ minWidth: 60 }}>
        {leftAction}
      </div>

      {/* Title */}
      <strong
        style={{
          marginLeft: leftAction ? 12 : 0,
        }}
      >
        {title}
      </strong>

      {/* Right Actions */}
      <div
        style={{
          marginLeft: "auto",
        }}
      >
        {rightAction}
      </div>
    </div>
  );
}