// app/client/bookings/page.tsx
import Sidebar from "@/components/client/Sidebar";
import Header from "@/components/client/Header";
import Bookings from "@/components/client/bookings/Bookings";

export default function ClientBookingsPage() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />
      <main className="lg:ml-64 flex-1 pt-24 px-4 md:px-8 pb-8">
        <Header />
        <Bookings />
      </main>
    </div>
  );
}