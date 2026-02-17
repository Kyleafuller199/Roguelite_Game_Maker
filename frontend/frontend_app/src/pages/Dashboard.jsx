/**
 * Dashboard.jsx
 *
 * Primary authenticated landing page.
 *
 * Responsibilities:
 * - Composes the app shell layout (header + sidebar + main content)
 * - Hosts dashboard widgets / overview content (placeholder for now)
 */

import TwoColumnLayout from "@/layouts/TwoColumnLayout";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

/**
 * Dashboard
 *
 * Routed at "/dashboard".
 * Uses the main application shell layout.
 */
export default function Dashboard() {
  return (
    <TwoColumnLayout
      header={<AppHeader title="Dashboard" />}
      left={<Sidebar />}
    >
      <h2>Dashboard main area</h2>
    </TwoColumnLayout>
  );
}