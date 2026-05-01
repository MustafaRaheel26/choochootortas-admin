import { Order, OrderStatus } from '../types';
import { mockOrders } from '../mockData';

// Simulating API Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await delay(500);
    return [...mockOrders];
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    await delay(300);
    return mockOrders.find(o => o.id === id);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay(300);
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) throw new Error('Order not found');
    
    mockOrders[orderIndex] = { ...mockOrders[orderIndex], status };
    return mockOrders[orderIndex];
  }
};
