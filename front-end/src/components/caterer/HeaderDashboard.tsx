export default function HeaderDashboard() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold">Bonjour, L'Atelier Gourmet</h2>
        <p className="text-gray-500">Prêt pour les services d'aujourd'hui ?</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2">🔍</button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border">
          Caterer Mode
        </div>
      </div>
    </header>
  );
}