import { Button } from "../ui/Button";

export default function BecomeCatererCTA() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto bg-primary rounded-[2rem] p-12 lg:p-20 relative overflow-hidden text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">Are You a Professional Caterer?</h2>
          <p className="text-xl opacity-90 mb-10">
            Join Caterly today to grow your business, reach new clients, and manage your bookings all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="lg">Start Selling</Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">Learn More</Button>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 hidden lg:block opacity-20">
          <span className="material-symbols-outlined text-[15rem]">skillet</span>
        </div>
      </div>
    </section>
  );
}