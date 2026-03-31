export default function SearchFooter() {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-primary/10 px-10 py-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
            <h2 className="text-xl font-bold">Caterly</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Elevating your events with the perfect culinary experiences. Search, book, and enjoy.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li className="hover:text-primary cursor-pointer">About Us</li>
            <li className="hover:text-primary cursor-pointer">Careers</li>
            <li className="hover:text-primary cursor-pointer">Press</li>
            <li className="hover:text-primary cursor-pointer">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li className="hover:text-primary cursor-pointer">Help Center</li>
            <li className="hover:text-primary cursor-pointer">Terms of Service</li>
            <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
            <li className="hover:text-primary cursor-pointer">Contact Us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Join Us</h4>
          <p className="text-sm text-slate-500 mb-4">Are you a caterer? Grow your business with Caterly.</p>
          <button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all">
            List Your Business
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <p>© 2024 Caterly Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-primary cursor-pointer">Instagram</span>
          <span className="hover:text-primary cursor-pointer">Twitter</span>
          <span className="hover:text-primary cursor-pointer">Facebook</span>
        </div>
      </div>
    </footer>
  );
}