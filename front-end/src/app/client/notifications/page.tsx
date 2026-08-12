import Notifications from "@/components/client/notifications/Notifications";
import Sidebar from "@/components/client/Sidebar";
import Header from "@/components/client/Header";

export default function ClientNotificationsPage() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />

      <main className="ml-72 flex-1 p-6 pt-24 max-w-[1200px] mx-auto">
        <Header />
        <Notifications />
      </main>
    </div>
  );
}