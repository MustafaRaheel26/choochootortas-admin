import { create } from 'zustand';
import { Order, MenuCategory, SalesReport, RestaurantSettings, MenuItem } from '../types';
import { getOrders, updateOrderStatus, OrderStatus } from '../services/orderService';
import { getMenu, addCategory, deleteCategory, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } from '../services/menuService';
import { getSalesReport, getSettings, updateSettings as updateSettingsAPI } from '../services/reportService';
import { adminLogin, adminLogout, isAuthenticated, getCurrentUser } from '../services/authService';

interface AppState {
  orders: Order[];
  menu: MenuCategory[];
  salesReport: SalesReport | null;
  settings: RestaurantSettings | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  currentUser: any;

  fetchOrders: () => Promise<void>;
  fetchMenu: () => Promise<void>;
  fetchReport: (range?: string) => Promise<void>;
  fetchSettings: () => Promise<void>;
  
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  toggleItemAvailability: (itemId: string, available: boolean) => Promise<void>;
  
  updateSettings: (settings: Partial<RestaurantSettings>) => Promise<void>;

  login: (password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  orders: [],
  menu: [],
  salesReport: null,
  settings: null,
  loading: false,
  error: null,
  isAuthenticated: isAuthenticated(),
  currentUser: getCurrentUser(),

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const orders = await getOrders();
      set({ orders, loading: false });
    } catch (err) {
      console.error('fetchOrders error:', err);
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  fetchMenu: async () => {
    set({ loading: true });
    try {
      const menu = await getMenu();
      set({ menu, loading: false });
    } catch (err) {
      console.error('fetchMenu error:', err);
      set({ error: 'Failed to fetch menu', loading: false });
    }
  },

  fetchReport: async (range = 'week') => {
    set({ loading: true });
    try {
      const salesReport = await getSalesReport(range);
      set({ salesReport, loading: false });
    } catch (err) {
      console.error('fetchReport error:', err);
      set({ error: 'Failed to fetch sales report', loading: false });
    }
  },

  fetchSettings: async () => {
    try {
      const settings = await getSettings();
      set({ settings });
    } catch (err) {
      console.error('fetchSettings error:', err);
      set({ error: 'Failed to fetch settings' });
    }
  },

  updateSettings: async (settingsData) => {
    try {
      console.log('📝 Updating settings:', settingsData);
      const updatedSettings = await updateSettingsAPI(settingsData);
      console.log('✅ Settings updated:', updatedSettings);
      set({ settings: updatedSettings });
    } catch (err) {
      console.error('updateSettings error:', err);
      throw err;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      await updateOrderStatus(id, status as OrderStatus);
      await get().fetchOrders();
    } catch (err) {
      console.error('updateOrderStatus error:', err);
      set({ error: 'Failed to update order status' });
    }
  },

  addCategory: async (name) => {
    try {
      await addCategory(name);
      await get().fetchMenu();
    } catch (err) {
      console.error('addCategory error:', err);
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      await deleteCategory(id);
      await get().fetchMenu();
    } catch (err) {
      console.error('deleteCategory error:', err);
      throw err;
    }
  },

  addItem: async (categoryId, item) => {
    try {
      await addMenuItem(categoryId, item);
      await get().fetchMenu();
    } catch (err) {
      console.error('addItem error:', err);
      throw err;
    }
  },

  updateItem: async (itemId, updates) => {
    try {
      await updateMenuItem(itemId, updates);
      await get().fetchMenu();
    } catch (err) {
      console.error('updateItem error:', err);
      throw err;
    }
  },

  deleteItem: async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      await get().fetchMenu();
    } catch (err) {
      console.error('deleteItem error:', err);
      throw err;
    }
  },

  toggleItemAvailability: async (itemId, available) => {
    try {
      await toggleItemAvailability(itemId, available);
      await get().fetchMenu();
    } catch (err) {
      console.error('toggleItemAvailability error:', err);
      throw err;
    }
  },

  login: async (password: string) => {
    try {
      const { token, user } = await adminLogin(password);
      set({ isAuthenticated: true, currentUser: user });
      return true;
    } catch (err) {
      console.error('login error:', err);
      set({ error: 'Invalid password' });
      return false;
    }
  },

  logout: () => {
    adminLogout();
    set({ isAuthenticated: false, currentUser: null });
  },

  checkAuth: () => {
    const auth = isAuthenticated();
    if (!auth) {
      set({ isAuthenticated: false, currentUser: null });
    }
    return auth;
  },
}));