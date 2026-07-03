import StatCard from "./StatCard";
import BookingCard from "./BookingCard";
import QuoteCard from "./QuoteCard";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-3 gap-6">
      
      {/* STATS */}
      <div className="col-span-3 grid grid-cols-5 gap-4">
        <StatCard title="Demandes" value={24} icon="📥" />
        <StatCard title="Devis" value={18} icon="📄" />
        <StatCard title="Bookings" value={9} icon="📅" />
        <StatCard title="Revenus" value="4.2k€" icon="💰" />
        <StatCard title="Rating" value="4.9" icon="⭐" />
      </div>

      {/* BOOKINGS */}
      <div className="col-span-2 space-y-3">
        <h3 className="font-bold text-lg">Prochaines réservations</h3>

        <BookingCard
          booking={{
            title: "Mariage Champêtre",
            date: "24 Oct",
            guests: 120,
            location: "Paris",
            price: "2850€",
            status: "confirmed",
          }}
        />
      </div>

      {/* QUOTES */}
      <div className="col-span-1 border rounded-xl bg-white">
        <h3 className="p-4 font-bold">Derniers devis</h3>

        <QuoteCard
          quote={{
            name: "Jean Dujardin",
            status: "Accepté",
            event: "Dîner privé",
            price: "745€",
          }}
        />
      </div>
    </div>
  );
}