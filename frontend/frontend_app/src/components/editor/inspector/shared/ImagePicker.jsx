/**
 * ImagePicker.jsx
 *
 * Shared image selector used across all asset image sections.
 * Fetches available PNG files from the backend for a given folder,
 * displays them as thumbnails, and stores the selected filename.
 *
 * Props:
 * - folder:   string — subfolder within roguelite_map_generator/assets/
 *                      e.g. "playable_characters", "monsters/basic", "card logos"
 * - value:    string — currently selected filename (e.g. "male.png")
 * - onChange: fn     — called with the selected filename string
 */

import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function ImagePicker({ folder, value, onChange }) {
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(false);

  useEffect(() => {
    if (!folder) return;
    setError(false);
    setLoading(true);
    setFiles([]);
    fetch(`${API_BASE}/api/assets/list/?folder=${encodeURIComponent(folder)}`)
      .then((r) => r.json())
      .then((data) => setFiles(data.files ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [folder]);

  function thumbUrl(filename) {
    return `${API_BASE}/api/assets/file/?path=${encodeURIComponent(folder + "/" + filename)}`;
  }

  if (error) {
    return (
      <div style={{ fontSize: 13, color: "#e57c3a", padding: "8px 0" }}>
        Could not reach backend — make sure Django is running on port 8000.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ fontSize: 13, opacity: 0.5, padding: "8px 0" }}>
        Loading...
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div style={{ fontSize: 13, opacity: 0.5, padding: "8px 0" }}>
        No images in this folder yet.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {files.map((file) => (
          <img
            key={file}
            src={thumbUrl(file)}
            alt={file}
            title={file}
            onClick={() => onChange(file)}
            style={{
              width: 72,
              height: 72,
              objectFit: "cover",
              borderRadius: 6,
              cursor: "pointer",
              border: value === file
                ? "2px solid #5cb85c"
                : "2px solid rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
      {value && (
        <div style={{ fontSize: 12, color: "#5cb85c" }}>Selected: {value}</div>
      )}
    </div>
  );
}
