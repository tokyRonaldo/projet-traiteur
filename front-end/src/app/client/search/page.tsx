// app/client/search/page.tsx
import Sidebar from "@/components/client/Sidebar";
import Header from "@/components/client/Header";
import Search from "@/components/client/search/Search";

export default function ClientSearchPage() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />
      <main className="lg:ml-64 flex-1 pt-24 px-4 md:px-8 pb-8">
        <Header />
        <Search />
      </main>
    </div>
  );
}