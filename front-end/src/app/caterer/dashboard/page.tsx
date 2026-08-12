// app/caterer/dashboard/page.tsx
import CatererLayout from "@/components/caterer/CatererLayout";
import DashboardGrid from "@/components/caterer/dashboard/DashboardGrid";

export default function CatererDashboard() {
  return (
    <CatererLayout>
      <DashboardGrid />
    </CatererLayout>
  );
}