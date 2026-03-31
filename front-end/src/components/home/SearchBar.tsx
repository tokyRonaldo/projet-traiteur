export default function SearchBar() {
  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl shadow-primary/10 border border-primary/5">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 px-4 py-2 bg-background-light dark:bg-slate-700 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Location</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <input className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full" placeholder="Enter city" type="text" />
          </div>
        </div>

        <div className="flex flex-col gap-1 px-4 py-2 bg-background-light dark:bg-slate-700 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Event Type</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">event</span>
            <select className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full">
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Corporate</option>
              <option>Private Party</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 px-4 py-2 bg-background-light dark:bg-slate-700 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Guests</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">groups</span>
            <input className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full" placeholder="50" type="number" />
          </div>
        </div>
      </div>

      <button className="w-full mt-3 bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">search</span>
        Search Caterers
      </button>
    </div>
  );
}