import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6">
            Exquisite <span className="text-primary">Catering</span> for Every Occasion
          </h1>
          <p className="text-lg text-neutral-text/80 dark:text-slate-300 mb-10 max-w-xl">
            Connect with top-rated local caterers. From intimate dinners to grand weddings, we bring the best flavors to your table.
          </p>
          <SearchBar />
        </div>

        <div className="relative">
          <div className="aspect-square rounded-3xl bg-primary/10 overflow-hidden shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3oCknyRU6u1FBS53KcE3O56RIKGRo2GXklm40QvabG-eouLFdzUapaqaMtQQoATeo_Q5fEF5Jji7cCxgHofjecG7u2xMkkCYBT9K4ihWUdOM7Nzbegx0ESDcCFaXmVvtGCF6aC5sI8TGuT7Ay-NO8kQST0WbkCwsvSsEmS281L_lXvswTGoGOQEAZwOyryr0iGcq70nKyW924TbSKQitbfL1NS83o1UuKzWxMZRojfTIb3Dw7TCfC29n575SgWYK7mrzTGQ7R48DI"
              alt="Elegant buffet setup with professional servers"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
            <div className="bg-secondary/20 p-3 rounded-full text-secondary">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div>
              <p className="font-bold text-lg">4.9/5 Rating</p>
              <p className="text-xs opacity-60">Over 500+ Top Caterers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}