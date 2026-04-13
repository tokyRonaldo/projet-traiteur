export const ConciergeCard = ({ userName }: { userName: string }) => (
  <div className="bg-primary text-on-primary p-6 rounded-2xl space-y-4 relative overflow-hidden shadow-xl shadow-primary/20">
    <div className="absolute -right-4 -bottom-4 opacity-10">
      <span className="material-symbols-outlined text-8xl">volunteer_activism</span>
    </div>
    <h4 className="font-bold text-lg leading-tight">Need a Hand,<br/>{userName.split(' ')[0]}?</h4>
    <p className="text-sm opacity-80">Connect with our concierge for bespoke event planning advice.</p>
    <button className="bg-white text-primary px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-orange-50 transition-colors">
      Contact Support
    </button>
  </div>
);