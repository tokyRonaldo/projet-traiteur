export default function Gallery() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Galerie
          </h1>

          <p className="text-gray-500 mt-2">
            Présentez vos plus belles réalisations afin d'attirer de nouveaux
            clients.
          </p>
        </div>

        <button className="px-5 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700">
          + Ajouter des photos
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <button className="px-5 py-2 rounded-full bg-orange-600 text-white">
          Toutes
        </button>

        <button className="px-5 py-2 rounded-full border">
          Mariage
        </button>

        <button className="px-5 py-2 rounded-full border">
          Anniversaire
        </button>

        <button className="px-5 py-2 rounded-full border">
          Entreprise
        </button>

        <button className="px-5 py-2 rounded-full border">
          Plats
        </button>
      </div>

      {/* Galerie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((photo) => (
          <div
            key={photo}
            className="bg-white rounded-xl shadow overflow-hidden group"
          >
            <div className="h-64 bg-gray-200" />

            <div className="p-4">
              <h3 className="font-semibold">
                Événement #{photo}
              </h3>

              <p className="text-sm text-gray-500">
                Mariage • Antananarivo
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <button className="text-blue-600 hover:underline">
                  Modifier
                </button>

                <button className="text-red-600 hover:underline">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}