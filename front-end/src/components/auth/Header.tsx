export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-red-700 dark:text-red-500 tracking-tight">
          Saffron Hearth
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-slate-600 dark:text-slate-400 font-medium hover:text-red-700 dark:hover:text-red-400 transition-colors">Marketplace</a>
          <a href="#" className="text-slate-600 dark:text-slate-400 font-medium hover:text-red-700 dark:hover:text-red-400 transition-colors">How it Works</a>
          <a href="#" className="text-slate-600 dark:text-slate-400 font-medium hover:text-red-700 dark:hover:text-red-400 transition-colors">Support</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2 rounded-full font-bold text-red-700 hover:bg-red-50 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}