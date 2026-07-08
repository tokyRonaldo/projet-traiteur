import Sidebar from "@/components/caterer/Sidebar";
import HeaderDashboard from "@/components/caterer/HeaderDashboard";
import DashboardGrid from "@/components/caterer/dashboard/DashboardGrid";

export default function CatererDashboard() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />

      <main className="ml-72 flex-1 p-6 max-w-[1200px] mx-auto">
        <HeaderDashboard />
        <DashboardGrid />
      </main>
    </div>
  );
}