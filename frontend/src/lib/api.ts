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
      signal: controller.signal,
    });
    
    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error("Connection Timeout: The server is taking too long to respond.");
    }
    if (err.message.includes("Failed to fetch")) {
      throw new Error("Connection Error: Unable to reach the server. Please check your connection.");
    }
    throw err;
  }
}

// Named exports for clarity across UI components
export const authApi = {
  login: async (body: URLSearchParams) => {
    // URLSearchParams required for OAuth2PasswordRequestForm
    const res = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail || "Login Failed");
    }
    return res.json();
  },
  signup: (userData: any) => apiFetch("/users", { method: "POST", body: JSON.stringify(userData) }),
};

export const metricsApi = {
  getDashboardStats: () => apiFetch("/dashboard/stats"),
  getInventory: () => apiFetch("/inventory"),
  getRequests: () => apiFetch("/requests"),
  submitRequest: (payload: any) => apiFetch("/requests", { method: "POST", body: JSON.stringify(payload) }),
};
