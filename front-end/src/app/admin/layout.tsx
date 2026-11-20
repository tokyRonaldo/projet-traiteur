// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useLogout } from '@/hooks/useLogout';
import LogoutConfirmModal from '@/components/shared/LogoutConfirmModal';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface AdminUser {
  name: string;
  email: string;
  roles: { name: string }[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { modalOpen, loading, requestLogout, cancelLogout, confirmLogout } = useLogout('/login');

  useEffect(() => {
    api
      .get('user')
      .then((user) => {
        const isAdmin = user?.roles?.some((r: { name: string }) => r.name === 'admin');
        if (!isAdmin) {
          router.push('/login');
          return;
        }
        setAdmin(user);
      })
      .catch(() => router.push('/login'))
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Chargement...</div>;
  }
  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={requestLogout}
      />

      <div className="lg:ml-64">
        <AdminHeader
          name={admin.name}
          email={admin.email}
          onMenuClick={() => setSidebarOpen(true)}
          onLogoutClick={requestLogout}
        />
        <main className="px-4 pb-4 pt-20 md:px-8 md:pb-8 md:pt-24">{children}</main>
      </div>

      {modalOpen && (
        <LogoutConfirmModal onConfirm={confirmLogout} onCancel={cancelLogout} loading={loading} />
      )}
    </div>
  );
}