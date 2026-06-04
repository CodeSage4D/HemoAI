const API_BASE_URL = "/api";

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
      const serverMessage = errorData?.message || errorData?.detail || "";

      switch (response.status) {
        case 401:
          throw new Error(serverMessage || "Invalid Credentials");
        case 403:
          throw new Error("Forbidden Access");
        case 404:
          throw new Error("API Not Found");
        case 500:
          throw new Error("Internal Server Error");
        case 503:
          throw new Error("Service Unavailable");
        default:
          throw new Error(serverMessage || `API Error: ${response.status}`);
      }
    }

    const json = await response.json();
    if (json && json.status === "success" && json.data !== undefined) {
      return json.data;
    }
    return json;
  } catch (err: unknown) {
    clearTimeout(id);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error("Request Timeout");
      }
      if (err.message.includes("Failed to fetch") || err.message.includes("fetch failed")) {
        throw new Error("Backend Offline");
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
  login: async (email: string, password: string) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  signup: (userData: SignupPayload) => {
    const { full_name, ...rest } = userData;
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...rest,
        fullName: full_name,
      }),
    });
  },
};

export const metricsApi = {
  getDashboardStats: () => apiFetch("/dashboard/stats"),
  getInventory: () => apiFetch("/logistics/inventory"),
  getRequests: () => apiFetch("/logistics/requests"),
  submitRequest: (payload: BloodRequestPayload) => apiFetch("/logistics/requests", { method: "POST", body: JSON.stringify(payload) }),
  updateRequestStatus: (id: string, status: string) => apiFetch(`/logistics/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
