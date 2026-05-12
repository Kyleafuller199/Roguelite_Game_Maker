import { API_BASE, styles } from "@/components/game/shared/gameStyles";

/**
 * SceneLayout
 *
 * Shared wrapper for all full-screen game scenes (combat, rest, treasure, event).
 * Renders a scene background image + dark overlay, then children on top.
 *
 * Children that need to appear above the overlay should set:
 *   position: "relative", zIndex: 2
 * Children that need to cover the whole screen (e.g. outcome overlays) should use:
 *   position: "absolute", inset: 0, zIndex: 10+
 */
export default function SceneLayout({ bgPath, overlayOpacity = 0.45, children }) {
  return (
    <div style={{ ...styles.page, position: "relative" }}>
      <img
        src={`${API_BASE}/api/assets/file/?path=${bgPath}`}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${overlayOpacity})`,
        zIndex: 1,
      }} />
      {children}
    </div>
  );
}
