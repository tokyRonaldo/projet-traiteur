// src/components/home/BlogTips.tsx
const articles = [
  {
    title: "Top 10 Food Trends for 2024 Weddings",
    category: "Catering Trends",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXBur_Oou-CzdUE4PjZdKxge4Ar7mq1IJxHIy9dlljCo5xfX9jjNSSVboXNghS_cSk0D4g_ZzCIb8vDnIJpdIVkCEA7-B9TJLFRK0Em-_Iy39hfgyYiFEPGt1C5IEi4VjjLI9WgYhUXv-ofQP7hAHi6Yiswd5LTDTB1746nCfVuHMehtrrmT3Wp_sT6Y2P2jbJ2fEX7_wOMtdJaDxvUWZXHd15rowiNbiyVrkoyHq7AR0aL6JmKr-88vP-1OzsAtuvGltxOkJ9sTWY",
  },
  {
    title: "How to Calculate Catering Costs Per Person",
    category: "Budgeting",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQir_PP__eOLRTZUgtYmmfA3EPz051fpKe0z-Q9ZGqW6EtD7P84X0liTtzDnijBWIWDeOmPzqhVBvSLsBfcs850U0CZW0UZPwIbhnKRdaj7927adNE5Ro_CGwdCAKCTzTbB_OdgXHVmapLEO22dIRop-0K_Z0TmhrieBH0njUcLSp0PGOXCkyNlOgQzQTi5aVLactpOzhkrUDlNQCTtvjNQ8RUSzB2ZiIK_f40GUQjMGVnIuquZ0VGEGNJMmbNcLYKZ0CGCUTC9AwE",
  },
  {
    title: "Planning the Perfect Office Holiday Party",
    category: "Corporate Tips",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvf2P0s779pJmSXs7GHRivAZN46G7_GF-UQKvqKVqBBQztwrPGbykeHF7XO0Ybeq1bEjmJfjztEy2UnfIKBvwHaE8xjK_SA_PVKAvTN1fRntIs1o3Z0pLflcSIedG_Fl0-byS6Qstyfp1_GjTpL9pgZyaxh0pGdDhajxoEiErGBGUiRCBHmJe94eWt3WX71OFRu5L10Un-W3g_Om1MTlnXdN8g-RJIgXItQjeFze0bq6xm2l8wvmLXMLIHCHg0bKvHZNxLHA9QzMrZ",
  },
];

export default function BlogTips() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">Event Planning Tips</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="h-64 rounded-2xl overflow-hidden mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-primary uppercase">{article.category}</span>
              <h4 className="text-xl font-bold mt-2 mb-3">{article.title}</h4>
              <p className="text-sm opacity-60 line-clamp-2">
                Discover the latest trends and tips to make your event unforgettable.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}