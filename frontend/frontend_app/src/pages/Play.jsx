import OneColumnLayout from "@/layouts/OneColumnLayout";
import AppHeader from "@/components/AppHeader";

export default function Play() {
  return (
    <OneColumnLayout
      header={<AppHeader title="Play" />}
    >
      <h2>Play main area</h2>
    </OneColumnLayout>
  );
}
