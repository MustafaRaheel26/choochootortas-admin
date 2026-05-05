/**
 * Order Service - Connected to Backend API
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

// ==================== ORDER TYPES ====================

export enum OrderStatus {
  NEW = "new",
  PREPARING = "preparing",
  READY = "ready",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum OrderType {
  EAT_IN = "eat-in",
  TAKE_OUT = "take-out",
}

export interface OrderItem {
  id?: string;
  itemName: string;
  quantity: number;
  price: number;
  removeIngredients: string[];
  extraIngredients: string[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  tax: number;
  createdAt: string;
}

// ==================== ORDER API ====================

// Get all orders
export async function getOrders(): Promise<Order[]> {
  const response = await apiCall<{ data: Order[] }>("/orders");
  return response.data;
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order> {
  const response = await apiCall<{ data: Order }>(`/orders/${id}`);
  return response.data;
}

// Update order status (requires auth)
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const response = await apiCall<{ data: Order }>(`/orders/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return response.data;
}
