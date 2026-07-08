import Sidebar from "@/components/caterer/Sidebar";
import Header from "@/components/caterer/Header";
import Messages from "@/components/caterer/messages/Messages";

export default function CatererMessage() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />

      <main className="ml-72 flex-1 p-6 pt-24 max-w-[1200px] mx-auto">
        <Header />
        <Messages />
      </main>
    </div>
  );
}