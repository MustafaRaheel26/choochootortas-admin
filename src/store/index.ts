import { create } from 'zustand';
import { Order, MenuCategory, SalesReport, RestaurantSettings, MenuItem } from '../types';
import { orderService } from '../services/orderService';
import { menuService } from '../services/menuService';
import { reportService, settingsService } from '../services/reportService';

interface AppState {
  orders: Order[];
  menu: MenuCategory[];
  salesReport: SalesReport | null;
  settings: RestaurantSettings | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  fetchOrders: () => Promise<void>;
  fetchMenu: () => Promise<void>;
  fetchReport: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  toggleItemAvailability: (itemId: string, available: boolean) => Promise<void>;

  login: (password: string) => boolean;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  orders: [],
  menu: [],
  salesReport: null,
  settings: null,
  loading: false,
  error: null,
  isAuthenticated: false, // Default to false

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const orders = await orderService.getOrders();
      set({ orders, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  fetchMenu: async () => {
    set({ loading: true });
    try {
      const menu = await menuService.getMenu();
      set({ menu, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch menu', loading: false });
    }
  },

  fetchReport: async () => {
    set({ loading: true });
    try {
      const salesReport = await reportService.getSalesReport();
      set({ salesReport, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch sales report', loading: false });
    }
  },

  fetchSettings: async () => {
    try {
      const settings = await settingsService.getSettings();
      set({ settings });
    } catch (err) {
      set({ error: 'Failed to fetch settings' });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      const orders = await orderService.getOrders();
      set({ orders });
    } catch (err) {
      set({ error: 'Failed to update order status' });
    }
  },

  addCategory: async (name) => {
    await menuService.addCategory(name);
    await get().fetchMenu();
  },

  deleteCategory: async (id) => {
    await menuService.deleteCategory(id);
    await get().fetchMenu();
  },

  addItem: async (categoryId, item) => {
    await menuService.addItem(categoryId, item);
    await get().fetchMenu();
  },

  updateItem: async (itemId, updates) => {
    await menuService.updateItem(itemId, updates);
    await get().fetchMenu();
  },

  deleteItem: async (itemId) => {
    await menuService.deleteItem(itemId);
    await get().fetchMenu();
  },

  toggleItemAvailability: async (itemId, available) => {
    try {
      await menuService.updateItemAvailability(itemId, available);
      const menu = await menuService.getMenu();
      set({ menu });
    } catch (err) {
      set({ error: 'Failed to update item availability' });
    }
  },

  login: (password: string) => {
    if (password === 'tortas2026') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false });
  }
}));
