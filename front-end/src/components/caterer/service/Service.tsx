// components/caterer/service/Service.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  PlusCircle,
  CheckCircle2,
  BanknoteIcon,
  Sparkles,
  NotebookPen,
  Pencil,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';

interface ServiceItem {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  is_active: boolean;
  badge?: string;
}

const CATEGORIES = ['Tous', 'Mariage', 'Entreprise', 'Chef privé', 'Saisonnier'];

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [page, setPage] = useState(1);
  const perPage = 4;

  useEffect(() => {
    setLoading(true);
    api
      .get('caterer/services') // adapte à ta vraie route si différente
      .then((res) => setServices(res.data ?? res))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCategory = category === 'Tous' || s.category === category;
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [services, category, search]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const activeCount = services.filter((s) => s.is_active).length;
  const averagePrice = services.length
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0;

  const handleToggle = async (id: number, current: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
    );
    try {
      await api.put(`caterer/service/${current ? 'disable' : 'enable'}/${id}`);
    } catch {
      // rollback en cas d'échec
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: current } : s))
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.delete(`caterer/service/delete/${id}`);
    } catch {
      // en cas d'échec, on pourrait recharger la liste
    }
  };

  return (
    <div>
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Mes services</h2>
          <p className="text-[#58423d] mt-2 max-w-2xl">
            Gérez vos offres de traiteur artisanal. Activez ou masquez vos menus, ajustez les prix,
            et affinez votre présentation professionnelle.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border-2 border-[#9b2f1e] text-[#9b2f1e] px-6 py-2 rounded-full font-bold hover:bg-[#9b2f1e]/5 transition-all">
            Modifier en masse
          </button>
          <button className="bg-[#9b2f1e] text-white px-6 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <PlusCircle className="w-5 h-5" strokeWidth={1.75} />
            Ajouter un service
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">
              Services actifs
            </span>
            <span className="p-2 bg-[#ffb4a6]/20 rounded-lg text-[#9b2f1e]">
              <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
            </span>
          </div>
          <span className="text-4xl font-bold leading-tight">{activeCount}</span>
          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" strokeWidth={2} /> sur {services.length} au total
          </span>
        </div>

        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">
              Prix moyen
            </span>
            <span className="p-2 bg-[#ffb961]/20 rounded-lg text-[#7a4b00]">
              <BanknoteIcon className="w-5 h-5" strokeWidth={1.75} />
            </span>
          </div>
          <span className="text-4xl font-bold leading-tight">{averagePrice} €</span>
          <span className="text-[#58423d] text-sm font-medium">Par personne, tous menus</span>
        </div>

        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">
              Brouillons en attente
            </span>
            <span className="p-2 bg-[#e7e2db] rounded-lg text-[#58423d]">
              <NotebookPen className="w-5 h-5" strokeWidth={1.75} />
            </span>
          </div>
          <span className="text-4xl font-bold leading-tight">
            {services.filter((s) => s.badge === 'draft').length}
          </span>
          <span className="text-[#58423d] text-sm font-medium">Menus saisonniers en préparation</span>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un service..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dfc0ba] rounded-full text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
          />
        </div>
      </div>

      {/* Table de gestion */}
      <div className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#dfc0ba] flex flex-wrap items-center gap-2 bg-[#f9f3ec]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-[#ffb4a6]/30 text-[#872111] border border-[#9b2f1e]/20 font-bold'
                  : 'text-[#58423d] hover:bg-[#ede7e0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[#dfc0ba]">
          {loading && <p className="p-6 text-[#58423d]">Chargement des services...</p>}

          {!loading && paginated.length === 0 && (
            <div className="p-10 text-center text-[#58423d]">
              <ImageOff className="w-10 h-10 mx-auto mb-2 text-[#8b716c]" strokeWidth={1.5} />
              Aucun service ne correspond à votre recherche.
            </div>
          )}

          {paginated.map((service) => (
            <div
              key={service.id}
              className={`group hover:bg-[#f9f3ec] transition-all p-4 flex flex-col md:flex-row md:items-center gap-4 ${
                !service.is_active ? 'opacity-70' : ''
              }`}
            >
              <div className="w-32 h-20 rounded-lg bg-[#ede7e0] flex items-center justify-center shrink-0 relative">
                <ImageOff className="w-6 h-6 text-[#8b716c]" strokeWidth={1.5} />
                {service.badge === 'bestseller' && (
                  <span className="absolute top-1 left-1 bg-[#ffddb9] text-[#2b1700] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Best-seller
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-[#1d1b17] text-lg">{service.title}</h3>
                  <span className="bg-[#e7e2db] text-[#58423d] text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                    {service.category}
                  </span>
                </div>
                <p className="text-sm text-[#58423d] line-clamp-1">{service.description}</p>
              </div>

              <div className="flex md:flex-col items-start md:items-end gap-1 shrink-0 px-4 border-l border-[#dfc0ba]/50">
                <span className="text-[#9b2f1e] font-bold text-lg">{service.price} €</span>
                <span className="text-xs text-[#58423d]">par personne</span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.is_active}
                      onChange={() => handleToggle(service.id, service.is_active)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#e7e2db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9b2f1e]" />
                  </label>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase ${
                      service.is_active ? 'text-[#9b2f1e]' : 'text-[#58423d]'
                    }`}
                  >
                    {service.is_active ? 'Actif' : 'Masqué'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-[#58423d] hover:text-[#9b2f1e] hover:bg-[#9b2f1e]/10 rounded-full transition-all">
                    <Pencil className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-[#58423d] hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button className="p-2 text-[#58423d] hover:bg-[#ede7e0] rounded-full transition-all">
                    <MoreVertical className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="p-4 bg-[#f9f3ec] border-t border-[#dfc0ba] flex items-center justify-between">
            <span className="text-sm text-[#58423d]">
              Affichage de {paginated.length} sur {filtered.length} services
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-[#ede7e0] transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                    page === p ? 'bg-[#9b2f1e] text-white' : 'text-[#58423d] hover:bg-[#ede7e0]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-[#ede7e0] transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Insight contextuel (garde uniquement l'utile) */}
      {services.length > 0 && (
        <div className="mt-6 bg-[#bc4733]/5 border border-[#9b2f1e]/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#9b2f1e] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h4 className="font-bold text-[#1d1b17] text-lg">Aperçu de performance</h4>
            <p className="text-sm text-[#58423d]">
              Consultez vos statistiques détaillées pour identifier vos services les plus demandés.
            </p>
            <a href="/caterer/statistics" className="text-[#9b2f1e] font-bold text-sm mt-2 inline-block hover:underline">
              Voir les statistiques
            </a>
          </div>
        </div>
      )}
    </div>
  );
}