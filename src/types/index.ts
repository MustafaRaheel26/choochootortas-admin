export enum OrderStatus {
  NEW = 'new',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderType {
  EAT_IN = 'eat-in',
  TAKE_OUT = 'take-out',
}

export interface OrderItem {
  id: string;
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

export interface MenuItem {
  id: string;
  itemName: string;
  price: number;
  description: string;
  ingredients: string[];
  removeOptions: string[];
  extras: { name: string; price: number }[];
  categoryId: string;
  image?: string;
  available: boolean;
  isBestseller?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface SalesReport {
  totalSales: number;
  taxCollected: number;
  totalOrders: number;
  itemsSoldByCategory: {
    categoryId: string;
    categoryName: string;
    count: number;
    revenue: number;
  }[];
  recentSales: {
    date: string;
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
}
