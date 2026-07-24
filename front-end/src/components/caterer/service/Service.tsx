// components/caterer/service/Service.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  PlusCircle,
  CheckCircle2,
  Banknote,
  NotebookPen,
  Pencil,
  Trash2,
  ImageOff,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import ServiceFormModal from './ServiceFormModal';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  price: number;
  event_type: string;
  is_active: boolean;
  category: { id: number; name: string } | null;
  thumbnail_url?: string | null;
}

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tous');
  const [page, setPage] = useState(1);
  const perPage = 4;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const loadServices = () => {
    setLoading(true);
    api
      .get('caterer/services')
      .then((res) => setServices(res.data ?? res))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(services.map((s) => s.category?.name).filter(Boolean));
    return ['Tous', ...Array.from(unique)] as string[];
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCategory = categoryFilter === 'Tous' || s.category?.name === categoryFilter;
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [services, categoryFilter, search]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const activeCount = services.filter((s) => s.is_active).length;
  const averagePrice = services.length
    ? Math.round(services.reduce((sum, s) => sum + Number(s.price), 0) / services.length)
    : 0;

  const handleToggle = async (id: number, current: boolean) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s)));
    try {
      await api.put(`caterer/service/${current ? 'disable' : 'enable'}/${id}`);
    } catch {
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: current } : s)));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.delete(`caterer/service/delete/${id}`);
    } catch {
      loadServices();
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Mes services</h2>
          <p className="text-[#58423d] mt-2 max-w-2xl">
            Gérez vos offres de traiteur artisanal. Activez ou masquez vos menus, ajustez les prix.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#9b2f1e] text-white px-6 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" strokeWidth={1.75} />
          Ajouter un service
        </button>
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
            <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">Prix moyen</span>
            <span className="p-2 bg-[#ffb961]/20 rounded-lg text-[#7a4b00]">
              <Banknote className="w-5 h-5" strokeWidth={1.75} />
            </span>
          </div>
          <span className="text-4xl font-bold leading-tight">{averagePrice} €</span>
          <span className="text-[#58423d] text-sm font-medium">Par personne, tous menus</span>
        </div>

        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">Total services</span>
            <span className="p-2 bg-[#e7e2db] rounded-lg text-[#58423d]">
              <NotebookPen className="w-5 h-5" strokeWidth={1.75} />
            </span>
          </div>
          <span className="text-4xl font-bold leading-tight">{services.length}</span>
          <span className="text-[#58423d] text-sm font-medium">Tous statuts confondus</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un service..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dfc0ba] rounded-full text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#dfc0ba] flex flex-wrap items-center gap-2 bg-[#f9f3ec]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat
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
            <div className="w-32 h-20 rounded-lg bg-[#ede7e0] flex items-center justify-center shrink-0 overflow-hidden">
              {service.thumbnail_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${service.thumbnail_url}`} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageOff className="w-6 h-6 text-[#8b716c]" strokeWidth={1.5} />
              )}
            </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-[#1d1b17] text-lg">{service.title}</h3>
                  {service.category && (
                    <span className="bg-[#e7e2db] text-[#58423d] text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                      {service.category.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#58423d] line-clamp-1">{service.description}</p>
              </div>

              <div className="flex md:flex-col items-start md:items-end gap-1 shrink-0 px-4 border-l border-[#dfc0ba]/50">
                <span className="text-[#9b2f1e] font-bold text-lg">{Number(service.price)} €</span>
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
                  <button
                    onClick={() =>
                      openEditModal({
                        ...service,
                      } as any)
                    }
                    className="p-2 text-[#58423d] hover:text-[#9b2f1e] hover:bg-[#9b2f1e]/10 rounded-full transition-all"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-[#58423d] hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="p-4 bg-[#f9f3ec] border-t border-[#dfc0ba] flex items-center justify-between">
            <span className="text-sm text-[#58423d]">
              Affichage de {paginated.length} sur {filtered.length} services
            </span>
            <div className="flex gap-1">
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
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ServiceFormModal
          initialData={
            editingService
              ? {
                  id: editingService.id,
                  title: editingService.title,
                  description: editingService.description,
                  price: String(editingService.price),
                  category_id: String(editingService.category?.id ?? ''),
                  event_type: editingService.event_type,
                }
              : null
          }
          onClose={() => setModalOpen(false)}
          onSaved={loadServices}
        />
      )}
    </div>
  );
}