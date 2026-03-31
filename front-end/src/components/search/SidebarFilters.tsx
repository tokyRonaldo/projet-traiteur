export default function SidebarFilters() {
  return (
    <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Advanced Filters</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Refine your search results</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Event Type */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Event Type</h3>
          <div className="flex flex-col gap-2">
            {['Wedding', 'Corporate Event', 'Birthday Party', 'Private Dinner'].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5"
                  defaultChecked={type === 'Wedding'}
                />
                <span className="text-sm group-hover:text-primary">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Location</h3>
          <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark text-sm focus:border-primary focus:ring-primary p-3">
            <option>New York City, NY</option>
            <option>Chicago, IL</option>
            <option>Los Angeles, CA</option>
            <option>Miami, FL</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Price Range</h3>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            className="w-full h-2 bg-primary/20 rounded-lg accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Rating</h3>
          {['4.0+ Stars', '3.0+ Stars'].map((rating, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                className="text-primary focus:ring-primary h-5 w-5"
                defaultChecked={i === 0}
              />
              <span className="text-sm group-hover:text-primary flex items-center gap-1">
                {rating} <span className="material-symbols-outlined text-yellow-500 text-sm fill-1">star</span>
              </span>
            </label>
          ))}
        </div>

        {/* Cuisine Type */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Cuisine Type</h3>
          <div className="flex flex-wrap gap-2">
            {['Italian', 'Vegan', 'French', 'Japanese', 'Mexican'].map((cuisine) => (
              <span
                key={cuisine}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  cuisine === 'Italian'
                    ? 'bg-primary text-white'
                    : 'bg-primary/10 hover:bg-primary/20 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Availability</h3>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/5 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <span className="text-sm font-medium">Check Dates</span>
          </div>
        </div>
      </div>
    </aside>
  );
}