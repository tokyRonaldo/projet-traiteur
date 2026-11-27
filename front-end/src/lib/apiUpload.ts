const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function apiUpload(endpoint: string, formData: FormData) {
  const token = getToken();

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }

  const data = await res.json().catch(() => ({
    message: 'Erreur serveur',
  }));

  if (!res.ok) {
    throw new Error(data.message || "Échec de l'envoi de l'image.");
  }

  return data;
}