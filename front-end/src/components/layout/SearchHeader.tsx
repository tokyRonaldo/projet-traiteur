import { Button } from "../ui/Button";
export default function SearchHeader() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white dark:bg-background-dark px-6 md:px-10 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-primary">
          <div className="size-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">Caterly</h2>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex w-full max-w-md items-stretch rounded-xl h-10 bg-primary/5 dark:bg-primary/20">
            <div className="text-primary flex items-center justify-center pl-4 rounded-l-xl">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              type="text"
              placeholder="Search caterers..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" icon={<span className="material-symbols-outlined">notifications</span>} className="h-10 w-10 p-0" />
        <Button variant="ghost" size="sm" icon={<span className="material-symbols-outlined">favorite</span>} className="h-10 w-10 p-0" />
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer">JD</div>
      </div>
    </header>
  );
}