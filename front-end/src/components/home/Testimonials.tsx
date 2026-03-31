// src/components/home/Testimonials.tsx
const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Wedding Client",
    text: "Caterly made our wedding planning so much easier! We found an amazing caterer who customized the menu perfectly for our dietary needs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKq7nNrfhTg_12LmUbQ4gEIIZMYNUQI7maQbuDgk1bptacVzxjjBETVBBSLOraOBAAL7qsEwv5mxCcS8p9Jurht62bLNxMbZN_gstZfF4Nr3bVvq6sq8H-UYnI8mGFQP-qCIkGS2YeYdwx6_H4C_SuSmaXtDL7QXfJT8uf1KQoEkEJ125LyubLJaE90dJ6e04fLloDDpOPPL6Jzj2AkFiV0J31FYfA7zeFxZzS1y9zSnkXDR6El7ppSvucjr7seyd1_cIsoo41DV1J",
  },
  {
    name: "Michael Chen",
    role: "Corporate Planner",
    text: "Professional service and seamless booking. The lunch for our corporate gala was spectacular and the talk of the office for weeks.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQRTzl4F6Ptt5Prz3vI6hpDj0S3wVbM84MpeKQ85YE678NYj7z0CMQiYDsi6mQXYP1_A_PeJlO3eCVAXPCy1wFC7C0-953kfHG6drT88gzyTiyLkudjUBSFrisDgDRV1xudCRjHz0AMzUKQcu4ORyzzTfnbqkkdHD23dqMB_T8qIkxghfiJIAqorAsyoxRfZEbLag6wxOQX6xcdq0gJQ4xS-eeW2v-Ri_WAALvta0rDO2WvkmVjML1lrlenf112UEDwNjDJJtQgZy",
  },
  {
    name: "Elena Rodriguez",
    role: "Birthday Event",
    text: "The variety of cuisines available is impressive. We booked a Mexican street food caterer for my 30th and it was a massive hit!",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYq8cbJ7JEwVMKNvtlNsb9biEzQjsnun06czdgwbzOs-TvYbKnEdqOCGCjwwEQxRZwxyKnM481cSTA344bFCVJVByNTAWiD8UbuBYp1tR1K-ZyfRpUvPJDYnNXDK3Y3x6-897Vv7mD6HH4Qr-TU6v117RXEG3FPBktq57b150fuObgM7jFu4cQGSk34AByDqJ7IRDDE0Zp793YJInGEfv_60aqzDrJVO6hcQakrOpregVMpnhvweaGVDC9Mgwec3XNjCI5Be2KMlg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <div className="flex justify-center gap-1 text-secondary">
            {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined fill-1">star</span>)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-primary/5">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h5 className="font-bold">{t.name}</h5>
                  <p className="text-xs opacity-60">{t.role}</p>
                </div>
              </div>
              <p className="italic text-lg leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}