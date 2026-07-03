// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || 'Erreur serveur');
  }

  return res.json();
}

export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body?: any) =>
    request(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (endpoint: string, body?: any) =>
    request(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
};