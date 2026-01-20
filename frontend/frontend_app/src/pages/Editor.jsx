import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import AppHeader from "../components/AppHeader";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";

export default function Editor() {
  return (
    <ThreeColumnLayout
      header={<AppHeader title="Editor" />}
      left={<Sidebar />}
      right={<RightPanel />}
    >
      <h2>Editor main area</h2>
    </ThreeColumnLayout>
  );
}