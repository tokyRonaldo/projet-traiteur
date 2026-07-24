import Sidebar from "@/components/client/Sidebar";
import Header from "@/components/client/Header";
import Messages from "@/components/client/messages/Messages";

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