export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 pt-20 pb-10 border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg text-white">
                <span className="material-symbols-outlined text-sm">restaurant</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-primary">Caterly</h2>
            </div>
            <p className="text-sm opacity-60 mb-6">
              Making professional event catering accessible and simple for everyone, everywhere.
            </p>
            <div className="flex gap-4">
              {['social_leaderboard', 'share', 'alternate_email'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-sm opacity-60">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Blog</a></li>
              <li><a href="#" className="hover:text-primary">How it Works</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6">Services</h5>
            <ul className="space-y-4 text-sm opacity-60">
              <li><a href="#" className="hover:text-primary">Wedding Catering</a></li>
              <li><a href="#" className="hover:text-primary">Corporate Events</a></li>
              <li><a href="#" className="hover:text-primary">Private Chefs</a></li>
              <li><a href="#" className="hover:text-primary">Party Platters</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6">Support</h5>
            <ul className="space-y-4 text-sm opacity-60">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs opacity-40">
          <p>© 2024 Caterly Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>English (US)</span>
            <span>USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}