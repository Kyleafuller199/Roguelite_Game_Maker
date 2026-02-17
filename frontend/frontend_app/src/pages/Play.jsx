/**
 * Play.jsx
 *
 * Gameplay entry page (in-app).
 *
 * Responsibilities:
 * - Uses a simple one-column layout
 * - Renders an app header
 * - Hosts the play/runtime UI (placeholder for now)
 */

import OneColumnLayout from "@/layouts/OneColumnLayout";
import AppHeader from "@/components/AppHeader";

/**
 * Play
 *
 * Routed at "/play".
 * Intended to host the playable game runtime view.
 */
export default function Play() {
  return (
    <OneColumnLayout
      header={<AppHeader title="Play" />}
    >
      <h2>Play main area</h2>
    </OneColumnLayout>
  );
}
