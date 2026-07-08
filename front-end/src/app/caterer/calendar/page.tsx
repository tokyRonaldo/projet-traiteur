import Sidebar from "@/components/caterer/Sidebar";
import Header from "@/components/caterer/Header";
import Calendar from "@/components/caterer/calendrier/Calendar";
export default function CatererCalendrier() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />

      <main className="ml-72 flex-1 p-6 pt-24 max-w-[1200px] mx-auto">
        <Header />
        <Calendar />
      </main>
    </div>
  );
}