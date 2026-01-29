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
