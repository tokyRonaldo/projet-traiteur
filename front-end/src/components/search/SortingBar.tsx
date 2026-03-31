export default function SortingBar() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm border border-primary/5">
      <h2 className="text-lg font-bold">128 Results found</h2>

      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
        <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-5">
          <span className="text-sm font-medium">Popularity</span>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/5 text-slate-700 dark:text-slate-300 px-5 hover:bg-primary/10 border border-primary/10">
          Price
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/5 text-slate-700 dark:text-slate-300 px-5 hover:bg-primary/10 border border-primary/10">
          Rating
        </button>
      </div>
    </div>
  );
}