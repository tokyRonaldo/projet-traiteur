import Link from "next/link";

const menu = [
  "Dashboard",
  "Profil",
  "Services",
  "Galerie",
  "Disponibilité",
  "Demandes",
  "Devis",
  "Réservations",
  "Messages",
  "Avis & Notes",
  "Paiements",
  "Abonnement",
  "Paramètres",
  "Notifications",
];

export default function Sidebar() {
  return (
    <aside className="w-72 fixed left-0 top-0 h-full bg-white border-r p-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-red-600">Saffron Hearth</h1>
      <p className="text-xs text-gray-500 mb-6">Artisanal Catering</p>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item}
            href="#"
            className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            {item}
          </Link>
        ))}
      </nav>

      <button className="mt-6 w-full bg-red-600 text-white py-2 rounded-full">
        Nouveau devis
      </button>
    </aside>
  );
}