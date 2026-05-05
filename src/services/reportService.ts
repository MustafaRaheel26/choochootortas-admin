/**
 * Report Service - Connected to Backend API
 */

const API_BASE_URL = "https://choochootortas-backend.onrender.com/api";

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Something went wrong");
  }

  return data;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

// Create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ==================== REPORT TYPES ====================

export interface SalesReport {
  totalSales: number;
  taxCollected: number;
  totalOrders: number;
  avgOrderValue: number;
  currentTaxRate: number;
  dineInTotal: number;
  takeOutTotal: number;
  dineInCount: number;
  takeOutCount: number;
  itemsSoldByCategory: {
    categoryId: string;
    categoryName: string;
    count: number;
    revenue: number;
  }[];
  recentSales: {
    date: string;
    fullDate: string;
    amount: number;
    orders: number;
  }[];
}

export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
  currencySymbol: string;
}

// ==================== REPORT API ====================

// Get sales report (requires auth) - with date range support
export async function getSalesReport(range = "week"): Promise<SalesReport> {
  const response = await apiCall<{ data: SalesReport }>(
    `/reports/sales?range=${range}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
}

// Get daily sales data for chart (requires auth)
export async function getDailySales(
  range = "week",
): Promise<{ date: string; amount: number; orders: number }[]> {
  const response = await apiCall<{
    data: { date: string; amount: number; orders: number }[];
  }>(`/reports/sales/daily?range=${range}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// Get category sales breakdown (requires auth)
export async function getCategorySales(
  range = "week",
): Promise<
  { categoryId: string; categoryName: string; count: number; revenue: number }[]
> {
  const response = await apiCall<{
    data: {
      categoryId: string;
      categoryName: string;
      count: number;
      revenue: number;
    }[];
  }>(`/reports/categories?range=${range}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// Get restaurant settings (public - no auth needed for reading)
export async function getSettings(): Promise<RestaurantSettings> {
  const response = await apiCall<{ data: RestaurantSettings }>("/settings");
  return response.data;
}

// Update restaurant settings (requires auth)
export async function updateSettings(
  settings: Partial<RestaurantSettings>,
): Promise<RestaurantSettings> {
  console.log("📤 Sending settings update to backend:", settings);

  const token = getAuthToken();
  console.log(
    "🔐 Using token:",
    token ? `${token.substring(0, 50)}...` : "NO TOKEN",
  );

  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

  const data = await response.json();
  console.log("📥 Response from backend:", data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to update settings");
  }

  return data.data;
}

// Get tax rate only (public - for kiosk)
export async function getTaxRate(): Promise<{
  taxRate: number;
  currencySymbol: string;
}> {
  const response = await apiCall<{
    data: { taxRate: number; currencySymbol: string };
  }>("/settings/tax");
  return response.data;
}
