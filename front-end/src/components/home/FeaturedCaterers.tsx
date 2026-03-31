import CatererCard from '../ui/CatererCard';

const featuredCaterers = [
  {
    name: "The Silver Platter",
    cuisine: "French Fusion & European Gourmet",
    rating: 4.8,
    price: 45,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPrW-vHgp0P1k7j8WMZRU5KHq-VnmVL3Ip-x80l9J7Zk1xBKFLlo_fxht-RnRngB7KGATviIePFNoTH5PFyWhBASvthohELGoMx2Oi5UUkMBd0Ggqm4Tz4jHG0KVKESrhdENyWG7tOQANdqC9PF_HuLNO_m77uhiVCKtODUm3Kz-wo3ETpoHoFU2tZZIpsPCx-PpSvxPjrUtPbn0ztkJB1Pbv1-NWb8s8FdvZDVbeF0QCXkKs0gBMixcEYvU8JwRWB3VliOli6JjKQ",
    featured: true,
  },
  {
    name: "Rustic Roots",
    cuisine: "Farm-to-Table & Organic BBQ",
    rating: 4.9,
    price: 32,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEAw23hqOix-z-EJbvUzfu8K6sAul1mOr1XpFijUNztGJeaAELTa0laiu__VBW01DnBTuEifgeS0le-RZn6GFhM_gcaTeVcjocp2_2Ho9NhGtVYJ9wdvby5ysT0OC9y42UidQlcIC1VG4-KRdPNwXvN5EDMmB_EiiHQ9rkmRc0kh-FKfUqYUb8sa-V2vDe2PN5ekJgioZJxoFYArTmrDH1RjqcusMA_Or8UJK4CyjrIxdWLqeO3wGIE5qQ_5cxWMPHEhXYL2GYEva9",
  },
  {
    name: "Spice Route",
    cuisine: "Mediterranean & Exotic Spices",
    rating: 4.7,
    price: 28,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAQKYzIpFPBwdew9FmyGQniPfhAigA_M3ABd0BxzmMSBiu6uMy5KxZS8zQYow947zLZ-cN9_vfBR1Tvqqz_SiQ5ja8zMAXAxIj9QAVe3J01sPIHCM83kl5V_eEagVN9H3QbFSd5UOM58DtqXBoDYqGSjBuLOsYxHXPHZrhF0DYVojuwXh-N5RiknFtvm9HDmuSEt3lArRs4Rl2faXvfURK87Au7-63vUz78bnB1Q4BnM888JYQ7-2kQ4F82Pc91JZtOmGkvjrwDJEB",
  },
];

export default function FeaturedCaterers() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Caterers</h2>
            <p className="opacity-60">Top performers picked by our event experts</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredCaterers.map((caterer, index) => (
            <CatererCard key={index} {...caterer} />
          ))}
        </div>
      </div>
    </section>
  );
}