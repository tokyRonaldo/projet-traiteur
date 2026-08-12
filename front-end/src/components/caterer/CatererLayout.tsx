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
  const { modalOpen, loading: logoutLoading, requestLogout, cancelLogout, confirmLogout } = useLogout('/login');

  useEffect(() => {
    api
      .get('caterer/profile')
      .then((data) => {
        console.log('hereee');
        setCaterer({
          company_name: data.company_name,
          location: data.location,
          verified: data.verified,
          logo_url: data.logo_url ?? null,
        })
      }
      )
      .catch(() => setCaterer(null))
      .finally(() => setProfileLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fef8f1]">
      <Sidebar caterer={caterer} profileLoading={profileLoading} onLogoutClick={requestLogout} />
      <main className="ml-72 flex-1 p-6 pt-24 max-w-[1200px] mx-auto">
        <Header caterer={caterer} onLogoutClick={requestLogout} />
        {children}
      </main>

      {modalOpen && (
        <LogoutConfirmModal onConfirm={confirmLogout} onCancel={cancelLogout} loading={logoutLoading} />
      )}
    </div>
  );
}