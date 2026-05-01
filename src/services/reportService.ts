import { SalesReport, RestaurantSettings } from '../types';
import { mockOrders, mockMenu } from '../mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
  getSalesReport: async (startDate?: Date, endDate?: Date): Promise<SalesReport> => {
    await delay(500);
    
    const totalSales = mockOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const taxCollected = mockOrders.reduce((acc, curr) => acc + curr.tax, 0);
    const totalOrders = mockOrders.length;

    // Dynamically calculate from menu and orders
    const itemsSoldByCategory = mockMenu.map(cat => {
      const catOrders = mockOrders.filter(o => 
        o.items.some(oi => cat.items.some(mi => mi.itemName === oi.itemName))
      );
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        count: catOrders.length * 15, // Multiplier for realism
        revenue: catOrders.reduce((acc, curr) => acc + curr.totalPrice, 0) * 12
      };
    });

    return {
      totalSales,
      taxCollected,
      totalOrders,
      itemsSoldByCategory,
      recentSales: [
        { date: 'Mon', amount: 450, orders: 32 },
        { date: 'Tue', amount: 520, orders: 38 },
        { date: 'Wed', amount: 380, orders: 28 },
        { date: 'Thu', amount: 610, orders: 45 },
        { date: 'Fri', amount: 820, orders: 62 },
        { date: 'Sat', amount: 980, orders: 74 },
        { date: 'Sun', amount: 740, orders: 56 },
      ]
    };
  }
};

export const settingsService = {
  getSettings: async (): Promise<RestaurantSettings> => {
    await delay(300);
    return {
      name: 'Choo Choo Tortas',
      address: '123 Railway Ave, Flavor Town, FT 54321',
      phone: '(555) 123-4567',
      email: 'hello@choochootortas.com',
      taxRate: 8.25,
      currency: 'USD'
    };
  }
};
