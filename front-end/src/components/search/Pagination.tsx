export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-12">
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 text-slate-500 hover:bg-primary/10">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 text-slate-700 hover:bg-primary/10">2</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 text-slate-700 hover:bg-primary/10">3</button>
      <span className="px-2 text-slate-400">...</span>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 text-slate-700 hover:bg-primary/10">12</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 text-slate-500 hover:bg-primary/10">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}