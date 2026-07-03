'use client';

import Sidebar from '@/components/client/Sidebar';
import Topbar from '@/components/client/Topbar';
import StatCard from '@/components/client/dashboard/StatCard';
import CatererCard from '@/components/client/dashboard/CatererCard';
import BookingTable from '@/components/client/dashboard/BookingTable';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="ml-64 flex-1 flex flex-col">

        <Topbar />

        <main className="p-6 space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Bonjour, Alex
            </h1>
            <p className="text-gray-500">
              Your next culinary experience is just around the corner.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard title="Total Bookings" value="12" icon="calendar_today" />
            <StatCard title="Messages" value="4 New" icon="mail" />
            <StatCard title="Next Event" value="Oct 24, 2024" icon="event_upcoming" highlight />
          </div>

          {/* Layout */}
          <div className="grid lg:grid-cols-12 gap-6">

            <div className="lg:col-span-8 space-y-6">

              {/* Booking table */}
              <BookingTable />

            </div>

            <aside className="lg:col-span-4 space-y-4">

              <h2 className="font-bold">Favorite Caterers</h2>

              <CatererCard name="Lumière Catering" rating="4.9" price="$85/pp" />
              <CatererCard name="Rustique Tables" rating="4.7" price="$60/pp" />
              <CatererCard name="Spice Route" rating="5.0" price="$75/pp" />

            </aside>

          </div>

        </main>
      </div>
    </div>
  );
}