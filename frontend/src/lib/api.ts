const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to get token
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic Fetch Wrapper with Timeout
export async function apiFetch(endpoint: string, options: RequestInit = {}, timeoutMs = 15000) {
  const customHeaders = options.headers as Record<string, string> || {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...customHeaders,
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
    
    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (err: unknown) {
    clearTimeout(id);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error("Connection Timeout: The server is taking too long to respond.");
      }
      if (err.message.includes("Failed to fetch")) {
        throw new Error("Connection Error: Unable to reach the server. Please check your connection.");
      }
    }
    throw err;
  }
}

export interface SignupPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
}

export interface BloodRequestPayload {
  patientId?: string;
  unitsRequired: number;
  hemoglobinLevel: number;
  diseaseType: string;
  patientName?: string;
  patientAge?: number;
  gender?: string;
  bloodGroup?: string;
}

// Named exports for clarity across UI components
export const authApi = {
  login: async (body: URLSearchParams) => {
    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail || "Login Failed");
    }
    return res.json();
  },
  signup: (userData: SignupPayload) => apiFetch("/auth/users", { method: "POST", body: JSON.stringify(userData) }),
};

export const metricsApi = {
  getDashboardStats: () => apiFetch("/dashboard/stats"),
  getInventory: () => apiFetch("/logistics/inventory"), // Assuming placeholder or future route
  getRequests: () => apiFetch("/logistics/requests"),
  submitRequest: (payload: BloodRequestPayload) => apiFetch("/logistics/requests", { method: "POST", body: JSON.stringify(payload) }),
};
