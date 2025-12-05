// API utility for making authenticated requests to the backend

const API_BASE_URL = import.meta.env.PROD ? '' : '';

// Get admin credentials for authenticated requests
function getAuthHeader(): string {
  const username = import.meta.env.VITE_ADMIN_USERNAME || '';
  const password = import.meta.env.VITE_ADMIN_PASSWORD || '';
  return 'Basic ' + btoa(`${username}:${password}`);
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// Products API
export const productsApi = {
  getAll: () => apiFetch<any[]>('/products'),
  
  create: (product: any) =>
    apiFetch<any>('/products', {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
      body: JSON.stringify(product),
    }),

  update: (product: any) =>
    apiFetch<any>('/products', {
      method: 'PUT',
      headers: { Authorization: getAuthHeader() },
      body: JSON.stringify(product),
    }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/products?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: getAuthHeader() },
    }),
};

// Hero Sections API
export const heroSectionsApi = {
  getAll: () => apiFetch<any[]>('/hero-sections'),

  create: (section: any) =>
    apiFetch<any>('/hero-sections', {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
      body: JSON.stringify(section),
    }),

  update: (section: any) =>
    apiFetch<any>('/hero-sections', {
      method: 'PUT',
      headers: { Authorization: getAuthHeader() },
      body: JSON.stringify(section),
    }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/hero-sections?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: getAuthHeader() },
    }),

  activate: (id: string) =>
    apiFetch<{ success: boolean; heroSections: any[] }>('/hero-sections/activate', {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
      body: JSON.stringify({ id }),
    }),
};

// Seed API
export const seedApi = {
  seed: () =>
    apiFetch<{ success: boolean; message: string }>('/seed', {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
    }),
};

