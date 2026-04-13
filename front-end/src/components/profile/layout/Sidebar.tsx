import React from 'react';

export const Sidebar = () => (
  <aside className="flex flex-col h-screen sticky top-0 bg-orange-50 dark:bg-slate-950 w-64 border-r-0 shadow-sm font-['Work_Sans'] font-normal text-slate-900 dark:text-slate-100 hidden md:flex">
    <div className="p-8">
      <span className="text-2xl font-black text-red-700 dark:text-red-500 tracking-tight">Saffron Hearth</span>
      <p className="text-xs uppercase tracking-widest text-on-surface-variant/60 mt-1">Catering Marketplace</p>
    </div>
    <nav className="flex-1 px-4 space-y-1">
      {[
        { icon: 'home', label: 'Home', active: false },
        { icon: 'search', label: 'Explore', active: false },
        { icon: 'description', label: 'My Requests', active: true },
        { icon: 'favorite', label: 'Favorites', active: false },
        { icon: 'chat', label: 'Messages', active: false },
        { icon: 'settings', label: 'Settings', active: false },
      ].map((item) => (
        <a
          key={item.label}
          href="#"
          className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 rounded-lg ${
            item.active 
              ? "text-red-700 dark:text-red-400 font-bold border-r-4 border-red-700 dark:border-red-500 bg-white/50 dark:bg-slate-800/50" 
              : "text-slate-600 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-white/80 dark:hover:bg-slate-800"
          }`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
    <div className="p-6 mt-auto">
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Pro Member</p>
        <p className="text-xs text-on-surface-variant">Access to exclusive artisan caterers and priority support.</p>
      </div>
    </div>
  </aside>
);