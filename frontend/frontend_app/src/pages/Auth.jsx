/**
 * Auth.jsx
 *
 * Authentication page (public).
 *
 * Responsibilities:
 * - Uses the public one-column layout
 * - Renders a public header with back navigation
 * - Hosts sign-in / sign-up UI (placeholder for now)
 */

import OneColumnLayout from "@/layouts/OneColumnLayout";
import PublicHeader from "@/components/PublicHeader";
import { Link } from "react-router-dom";

/**
 * Auth
 *
 * Routed at "/auth".
 * Currently provides basic navigation scaffolding until auth forms are implemented.
 */
export default function Auth() {
  return (
    <OneColumnLayout
      header={
        <PublicHeader
          title="Sign In"
          leftAction={<Link to="/">Back</Link>}
        />
      }
    >
      <h2>Auth main area</h2>

      {/* Temporary navigation until auth flow is implemented */}
      <Link to="/dashboard">Continue</Link>
    </OneColumnLayout>
  );
}
