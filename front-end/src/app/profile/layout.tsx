import { Sidebar } from "@/components/profile/layout/Sidebar";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 bg-surface-container-low flex flex-col lg:flex-row">
        {children}
      </main>
      
      {/* Navigation Mobile (Stick to bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md px-6 py-3 flex justify-between items-center z-50 border-t border-orange-100">
        <span className="material-symbols-outlined text-slate-400">home</span>
        <span className="material-symbols-outlined text-slate-400">search</span>
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
        <span className="material-symbols-outlined text-slate-400">favorite</span>
        <span className="material-symbols-outlined text-slate-400">account_circle</span>
      </nav>
    </div>
  );
}