const BASE = 'http://localhost:3000';

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export const register = (email: string, password: string, name: string) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) });

export const login = (email: string, password: string) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const logout = () =>
  request('/auth/logout', { method: 'POST' });

export const getMe = () =>
  request('/auth/me');

// Contractors
export const getContractors = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request(`/contractors${qs}`);
};

export const createContractor = (data: { name: string; phone: string; type: string; region: string }) =>
  request('/contractors', { method: 'POST', body: JSON.stringify(data) });

// Jobs
export const getJobs = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request(`/jobs${qs}`);
};

export const getJob = (id: string) =>
  request(`/jobs/${id}`);

export const createJob = (data: { title: string; description?: string; region: string; price: number }) =>
  request('/jobs', { method: 'POST', body: JSON.stringify(data) });

export const updateJobStatus = (id: string, status: string) =>
  request(`/jobs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

// Invites
export const getInvites = (jobId: string) =>
  request(`/jobs/${jobId}/invites`);

export const createInvite = (jobId: string, contractorId: string) =>
  request(`/jobs/${jobId}/invites`, { method: 'POST', body: JSON.stringify({ contractorId }) });

export const updateInviteStatus = (id: string, status: string) =>
  request(`/invites/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
