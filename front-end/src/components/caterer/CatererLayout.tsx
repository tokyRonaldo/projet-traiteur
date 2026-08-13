// components/caterer/CatererLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLogout } from '@/hooks/useLogout';
import LogoutConfirmModal from '@/components/shared/LogoutConfirmModal';
import Sidebar from './Sidebar';
import Header from './Header';

interface CatererInfo {
  company_name: string;
  location: string;
  verified: boolean;
  logo_url: string | null;
}

export default function CatererLayout({ children }: { children: React.ReactNode }) {
  const [caterer, setCaterer] = useState<CatererInfo | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { modalOpen, loading: logoutLoading, requestLogout, cancelLogout, confirmLogout } = useLogout('/login');

  useEffect(() => {
    api
      .get('caterer/profile')
      .then((data) => {
        setCaterer({
          company_name: data.company_name,
          location: data.location,
          verified: data.verified,
          logo_url: data.logo_url ?? null,
        });
      })
      .catch(() => setCaterer(null))
      .finally(() => setProfileLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar
        caterer={caterer}
        profileLoading={profileLoading}
        onLogoutClick={requestLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 lg:ml-72">
        <Header
          caterer={caterer}
          onLogoutClick={requestLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-6 pt-24 max-w-[1200px] mx-auto">{children}</div>
      </main>

      {modalOpen && (
        <LogoutConfirmModal onConfirm={confirmLogout} onCancel={cancelLogout} loading={logoutLoading} />
      )}
    </div>
  );
}