import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ServiceCard from '@/components/dashboard/ServiceCard';
import RequestsTable from '@/components/dashboard/RequestsTable';

export default function OverviewPage() {
  return (
    <div className="p-8 space-y-10">
      {/* Hero Header */}
      <section className="flex justify-between items-end">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#bf3a2b] mb-2 block">
            Caterer Dashboard
          </span>
          <h2 className="text-5xl font-black text-[#333333] tracking-tight">Overview</h2>
        </div>
        <div className="text-right">
          <p className="text-slate-500 font-medium">Friday, Apr 3, 2026</p>
        </div>
      </section>

      {/* Stats Grid: Bento Layout */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$42,850" trend="+12.5%" icon="payments" iconBg="bg-[#ffdad4]" iconColor="text-[#bf3a2b]" />
        <StatCard title="Active Requests" value="18" trend="4 Urgent" icon="pending_actions" iconBg="bg-[#ffb4a8]" iconColor="text-[#F39C12]" />
        <StatCard title="Total Bookings" value="124" trend="This Month" icon="event_available" iconBg="bg-[#c1e8ff]" iconColor="text-[#005876]" />
        <StatCard title="Average Rating" value="4.9" trend="428 Reviews" icon="star" iconBg="bg-amber-50" iconColor="text-[#F39C12]" isFilledIcon={true} />
      </section>

      {/* Profile & Services Spread */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <ProfileCard />
          
          {/* Upgrade Pro Card */}
          <div className="bg-[#F39C12] p-8 rounded-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">Upgrade to Pro</h4>
              <p className="text-white/80 text-sm mb-4">Get featured on the homepage and unlock detailed analytics.</p>
              <button className="bg-white text-[#F39C12] px-6 py-2 rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-transform">
                Learn More
              </button>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl group-hover:scale-110 transition-transform">
              workspace_premium
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#333333]">Catering Packages</h3>
            <button className="flex items-center gap-2 text-[#bf3a2b] font-bold hover:text-[#F39C12] transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
              Add New Package
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceCard 
              title="Wedding Excellence" 
              price={120} 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuD9hPD-THF-eiepQfrdYSvZAekFUdjL9MJHne8mvRcIIgCFbEdNgvP6nGvuPFdEJheFQtdEOav6NuXDWsn3GZHIKl2sAwxWYt06TCfGQJQhxIasujkoXo_vO9iMEtGgWMvwt7n6OnQqeVxuT1LCcIMg-ZHx0OHycP82-wlQbXyutkZOd7r2tFDK1BwZgdlYe_FOX-OWYlGLihkyXtm3XOGc8UJ2ZSf9di7jQxzN3X4BaLq3d1Xu_EzZqXDPZ3lXOvW3jeqYmECFmvRA" 
              badge="Best Seller"
              tags={['FR', 'IT']}
              description="Complete 5-course dinner service including cocktail hour and premium dessert station."
            />
            <ServiceCard 
              title="Corporate Lunch" 
              price={45} 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCl11BAtFOLeyJOc_5-M40urAsQnhLZszeQUcWrALblUqyqT0I-ySVxde_VYJiIuE0rGOlqsYiF78XnhOg8QLNZBSLmmnhtCK57svRnU52ZmTq-05_f_4_TM0gCeZowx5on_jYPArWdNJlnnFRDGTehc5ZM7BqSSmAlLnNR3a6ix2Pi75LscJZXpkjjH4XWkFnfA1MDCpOcaOAae2GJKTIX1bCLpC-SRqAX_YST_hdScelk_ucpsLYT5ZRSidQ-5_UVsOARXnpnfK_R" 
              badge="Popular"
              tags={['VG', 'GF']}
              description="Efficient and elevated sandwich platters, seasonal salads, and signature artisan beverages."
            />
          </div>
        </div>
      </section>

      <RequestsTable />
    </div>
  );
}