export default function PublicHeader({ title, leftAction, rightAction }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 12,
          borderBottom: "1px solid #ddd",
        }}
      >
        {leftAction}
  
        <strong style={{ marginLeft: leftAction ? 12 : 0 }}>
          {title}
        </strong>
  
        <div style={{ marginLeft: "auto" }}>
          {rightAction}
        </div>
      </div>
    );
  }
  