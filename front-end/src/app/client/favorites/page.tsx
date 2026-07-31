// app/client/favorites/page.tsx
import Sidebar from "@/components/client/Sidebar";
import Header from "@/components/client/Header";
import Favorites from "@/components/client/favorites/Favorites";

export default function FavoritesPage() {
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />
      <main className="ml-64 flex-1 pt-24 px-8 pb-8">
        <Header />
        <Favorites />
      </main>
    </div>
  );
}