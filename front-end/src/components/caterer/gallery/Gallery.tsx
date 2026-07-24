// components/caterer/gallery/Gallery.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { UploadCloud, Trash2, ImageOff, Film, X } from 'lucide-react';
import { api } from '@/lib/api';

interface MediaItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  position: number;
}

export default function Gallery() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = () => {
    setLoading(true);
    api
      .get('caterer/gallery')
      .then((res) => setMedia(res))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/caterer/gallery/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
      }
      loadMedia();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce média ?')) return;
    setMedia((prev) => prev.filter((m) => m.id !== id));
    try {
      await api.delete(`caterer/gallery/delete/${id}`);
    } catch {
      loadMedia();
    }
    setPreview(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Galerie du lieu &amp; événements</h2>
          <p className="text-[#58423d] mt-2 max-w-2xl">
            Ajoutez des photos de votre établissement, de vos événements passés, pour donner un aperçu
            authentique de votre travail. Les photos spécifiques à un service se gèrent directement
            depuis la fiche de ce service.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="bg-[#9b2f1e] text-white px-6 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <UploadCloud className="w-5 h-5" strokeWidth={1.75} />
            {uploading ? 'Envoi en cours...' : 'Ajouter des médias'}
          </button>
        </div>
      </div>

      {loading && <p className="text-[#58423d]">Chargement de la galerie...</p>}

      {!loading && media.length === 0 && (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-[#dfc0ba] rounded-xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#9b2f1e] transition-colors bg-white"
        >
          <ImageOff className="w-10 h-10 text-[#8b716c] mb-3" strokeWidth={1.5} />
          <p className="text-[#58423d] font-medium">Aucun média pour le moment.</p>
          <p className="text-sm text-[#8b716c] mt-1">Cliquez ici pour ajouter vos premières photos.</p>
        </div>
      )}

      {!loading && media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreview(item)}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#ede7e0] border border-[#dfc0ba] group cursor-pointer"
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1d1b17]">
                  <Film className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Aperçu en grand */}
      {preview && (
        <div
          className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1.75} />
          </button>

          {preview.type === 'image' ? (
            <img
              src={preview.url}
              alt=""
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={preview.url}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}