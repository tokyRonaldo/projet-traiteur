import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-80 bg-white border-l border-[#bf3a2b]/10 p-6 overflow-y-auto hidden lg:block">
      <div className="space-y-8">
        {/* Profile Completion */}
        <section>
          <h4 className="text-sm font-black text-[#333333] uppercase tracking-wider mb-4">Profile Completion</h4>
          <div className="bg-[#FFF8F2] rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full mb-4" 
                 style={{ background: 'conic-gradient(#bf3a2b 75%, #ffe9e6 0)' }}>
              <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#bf3a2b]">75%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Add a professional headshot to reach 100%.</p>
            <button className="text-xs font-bold text-[#bf3a2b] hover:text-[#F39C12] transition-colors">Complete Profile</button>
          </div>
        </section>

        {/* Quick Notifications */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-black text-[#333333] uppercase tracking-wider">Updates</h4>
            <span className="px-2 py-0.5 bg-[#bf3a2b]/10 text-[#bf3a2b] text-[10px] font-black rounded-full">3 NEW</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: 'mail', title: 'New request from Sarah', time: '2 minutes ago', color: 'text-[#F39C12]' },
              { icon: 'check_circle', title: 'Payment received ($1.2k)', time: '1 hour ago', color: 'text-emerald-500' },
              { icon: 'rate_review', title: 'New 5-star review!', time: 'Yesterday', color: 'text-[#bf3a2b]' },
            ].map((notif, i) => (
              <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-3">
                  <span className={`material-symbols-outlined ${notif.color} text-base`}>{notif.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-[#333333]">{notif.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule */}
        <section>
          <h4 className="text-sm font-black text-[#333333] uppercase tracking-wider mb-4">Upcoming Schedule</h4>
          <div className="space-y-4">
            <ScheduleItem day="25" month="OCT" title="Charity Gala Dinner" sub="6:30 PM • 120 Guests" />
            <ScheduleItem day="28" month="OCT" title="TechLoom Lunch" sub="12:00 PM • 45 Guests" />
          </div>
          <button className="w-full mt-6 py-3 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-bold hover:border-[#bf3a2b] hover:text-[#bf3a2b] transition-all">
            View Full Calendar
          </button>
        </section>
      </div>
    </aside>
  );
};

const ScheduleItem = ({ day, month, title, sub }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="flex-shrink-0 w-12 h-12 bg-[#bf3a2b]/5 rounded-xl flex flex-col items-center justify-center border border-[#bf3a2b]/10 group-hover:bg-[#bf3a2b] group-hover:text-white transition-all">
      <span className="text-[10px] font-black leading-none mb-1">{month}</span>
      <span className="text-base font-black leading-none">{day}</span>
    </div>
    <div>
      <p className="text-xs font-bold text-[#333333]">{title}</p>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  </div>
);

export default Sidebar;