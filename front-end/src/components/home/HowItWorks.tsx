// src/components/home/HowItWorks.tsx
export default function HowItWorks() {
  const steps = [
    { icon: "search_insights", title: "1. Find", desc: "Search caterers by location, event type, and guest count." },
    { icon: "compare_arrows", title: "2. Compare", desc: "Review menus, check ratings, and compare custom quotes." },
    { icon: "event_available", title: "3. Book", desc: "Secure your date with easy online booking and payments." },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-16">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative z-10">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl ${i === 2 ? 'bg-primary/20 text-primary' : 'bg-primary text-white shadow-primary/30'}`}>
                <span className="material-symbols-outlined text-4xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="opacity-60">{step.desc}</p>
            </div>
          ))}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-primary/10 -z-10" />
        </div>
      </div>
    </section>
  );
}