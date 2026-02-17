/**
 * Test.jsx
 *
 * Internal testing / sandbox page.
 *
 * Responsibilities:
 * - Uses the app shell layout (header + sidebar + main content)
 * - Hosts the test environment UI (placeholder for now)
 */
import TwoColumnLayout from "@/layouts/TwoColumnLayout";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

export default function Test() {
  return (
    <TwoColumnLayout
      header={<AppHeader title="Test" />}
      left={<Sidebar />}
    >
      <h2>Test main area</h2>
    </TwoColumnLayout>
  );
}
