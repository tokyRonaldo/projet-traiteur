import React from 'react';
import TopNav from '@/components/dashboard/TopNav';
import Sidebar from '@/components/dashboard/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FFF8F2] text-[#333333] min-h-screen font-['Work_Sans']">
      <TopNav />
      
      <div className="max-w-[1440px] mx-auto flex">
        <main className="flex-1 min-h-screen">
          {children}
          
          <footer className="p-10 text-center text-slate-400 text-xs font-medium border-t border-slate-100 mt-10">
            © 2026 Saffron Hearth Marketplace. All culinary rights reserved.
          </footer>
        </main>

        <Sidebar />
      </div>
    </div>
  );
}