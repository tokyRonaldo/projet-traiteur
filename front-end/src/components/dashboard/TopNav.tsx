import React from 'react';

const TopNav: React.FC = () => {
  const navItems = [
    { label: 'Overview', icon: 'dashboard', active: true },
    { label: 'Profile', icon: 'person' },
    { label: 'Services', icon: 'restaurant_menu' },
    { label: 'Requests', icon: 'pending_actions' },
    { label: 'Calendar', icon: 'calendar_month' },
    { label: 'Analytics', icon: 'analytics' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#bf3a2b]/10 shadow-sm w-full">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-black text-[#bf3a2b] tracking-tighter">Saffron Hearth</h1>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                  item.active ? 'text-[#bf3a2b] bg-[#bf3a2b]/5' : 'text-slate-500 hover:text-[#bf3a2b]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center bg-[#FFF8F2] rounded-full px-4 py-2 border border-[#e1bfb9] w-64">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" placeholder="Search..." type="text"/>
          </div>
          <button className="relative text-slate-600 hover:text-[#F39C12] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#bf3a2b] rounded-full"></span>
          </button>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#bf3a2b]/20">
            <img alt="Caterer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1urYFINazAGdozHGaZ48BGOPsrC-tTdjPwWxRVNEMoV9o-wETcS2GN2VmGaFJATYh87P6EiQFwY5Z2l3zDz6ItT83W5prwXRh-oEax5WfatVC83ZiOhEVNj6qkZ2ocEmJ2hW3JM4SB_cJCh8X6oIUJtHgcenmyRHJaomEq_bNWBRhUnSu0BBtahqplqzomuFH_WOekDieMA0n4-jV-U1HH-y_ho8apo4rk6Vnd8sYIEFsPsUZ4m9DWTQq4GxXnlyWshzERmHi9xQ4"/>
          </div>
          <button className="bg-[#bf3a2b] text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#bf3a2b]/20 active:scale-95 transition-transform">
            New Quote
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;