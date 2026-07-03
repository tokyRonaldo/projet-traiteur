'use client';

import Link from 'next/link';

export default function Sidebar() {
  const menu = [
    ['dashboard', 'Dashboard', true],
    ['search', 'Search Caterers'],
    ['favorite', 'Favorites'],
    ['calendar_today', 'Event Requests'],
    ['request_quote', 'Quotes'],
    ['event_available', 'Bookings'],
    ['chat_bubble', 'Messages'],
    ['star', 'Reviews'],
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low shadow-md flex flex-col p-4 space-y-2 overflow-y-auto z-50">
      <div className="mb-6">
        <h1 className="text-primary font-bold text-xl">Saffron Hearth</h1>
        <p className="text-xs opacity-70">Artisanal Catering</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menu.map(([icon, label, active]: any, i) => (
          <Link
            key={i}
            href="#"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
              active ? 'bg-primary text-white' : 'hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="w-full bg-primary text-white py-2 rounded-xl font-bold">
          Book Now
        </button>
      </div>
    </aside>
  );
}