/**
 * Root.jsx
 *
 * Public landing page of the application.
 *
 * Responsibilities:
 * - Composes the public layout
 * - Renders the PublicHeader
 * - Provides navigation to authentication routes
 */

import OneColumnLayout from "@/layouts/OneColumnLayout";
import PublicHeader from "@/components/PublicHeader";
import { Link } from "react-router-dom";

/**
 * Root
 *
 * Landing page component rendered at "/".
 * Uses a one-column layout with a public-facing header.
 */
export default function Root() {
  return (
    <OneColumnLayout
      header={
        <PublicHeader
          title="Roguelite Game Maker"
          rightAction={
            <>
              {/* Authentication links */}
              <Link to="/auth">Login</Link>{" "}
              <Link to="/auth">Create Account</Link>
            </>
          }
        />
      }
    >
      {/* Main content area */}
      <h2>Root main area</h2>
    </OneColumnLayout>
  );
}