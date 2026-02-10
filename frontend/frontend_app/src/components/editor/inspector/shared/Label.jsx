/**
 * Label.jsx
 * Small shared label component for inspector fields.
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