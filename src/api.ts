export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
  role?: 'student' | 'trainer';
}

export interface UserRecord {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'trainer';
  avatar?: string;
  batch?: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || response.statusText || 'API request failed');
  }
  return payload;
}

export async function authLogin(email: string, password: string) {
  return request<{ record: UserRecord }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function authSignup(payload: AuthPayload) {
  return request<{ record: UserRecord }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getUsers(role?: string) {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  return request<{ records: UserRecord[] }>(`/api/users${query}`);
}

export async function getAssignments() {
  return request<{ records: any[] }>('/api/assignments');
}

export async function getSessions() {
  return request<{ records: any[] }>('/api/sessions');
}

export async function getTasks(uid: string) {
  const query = uid ? `?uid=${encodeURIComponent(uid)}` : '';
  return request<{ records: any[] }>(`/api/tasks${query}`);
}

export async function getDashboard() {
  return request<{ stats: any[]; upcomingSessions: any[] }>('/api/dashboard');
}
