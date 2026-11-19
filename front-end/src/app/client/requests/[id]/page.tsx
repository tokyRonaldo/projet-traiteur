// app/client/requests/[id]/page.tsx
import Sidebar from "@/components/client/Sidebar";
import Header from "@/components/client/Header";
import RequestDetail from "@/components/client/requests/RequestDetail";

export default async function ClientRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar />
      <main className="lg:ml-64 flex-1 pt-24 px-4 md:px-8 pb-8">
        <Header />
        <RequestDetail requestId={id} />
      </main>
    </div>
  );
}