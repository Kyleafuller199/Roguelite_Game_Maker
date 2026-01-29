import TwoColumnLayout from "@/layouts/TwoColumnLayout";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

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