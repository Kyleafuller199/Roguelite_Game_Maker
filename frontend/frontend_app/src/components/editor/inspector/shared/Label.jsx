/**
 * Label.jsx
 *
 * Small shared label component for inspector fields.
 *
 * Responsibilities:
 * - Provides consistent spacing/opacity for field labels
 * - Keeps inspector sections visually consistent without repeating styles
 */

export default function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: 6,
        opacity: 0.8,
      }}
    >
      {children}
    </label>
  );
}