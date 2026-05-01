import { MenuCategory, MenuItem } from '../types';
import { mockMenu } from '../mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const menuService = {
  getMenu: async (): Promise<MenuCategory[]> => {
    await delay(400);
    return [...mockMenu];
  },

  addCategory: async (name: string): Promise<MenuCategory> => {
    await delay(300);
    const newCat = { id: `cat-${Date.now()}`, name, items: [] };
    mockMenu.push(newCat);
    return newCat;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockMenu.findIndex(c => c.id === id);
    if (index !== -1) mockMenu.splice(index, 1);
  },

  addItem: async (categoryId: string, item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    await delay(300);
    const category = mockMenu.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    const newItem = { ...item, id: `item-${Date.now()}` };
    category.items.push(newItem);
    return newItem;
  },

  updateItem: async (itemId: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
    await delay(300);
    let originalItem: MenuItem | null = null;
    let oldCatIndex = -1;
    let itemIndex = -1;

    for (let i = 0; i < mockMenu.length; i++) {
      const idx = mockMenu[i].items.findIndex(it => it.id === itemId);
      if (idx !== -1) {
        originalItem = mockMenu[i].items[idx];
        oldCatIndex = i;
        itemIndex = idx;
        break;
      }
    }

    if (!originalItem || oldCatIndex === -1 || itemIndex === -1) throw new Error('Item not found');

    const updatedItem = { ...originalItem, ...updates };

    // Move to different category if categoryId has changed
    const targetCategoryId = updates.categoryId;
    if (targetCategoryId && targetCategoryId !== mockMenu[oldCatIndex].id) {
      const newCat = mockMenu.find(c => c.id === targetCategoryId);
      if (newCat) {
        // Remove from old category
        mockMenu[oldCatIndex].items.splice(itemIndex, 1);
        // Add to new category
        newCat.items.push(updatedItem);
      } else {
        // If target category doesn't exist, just update in place (shouldn't happen with dropdown)
        mockMenu[oldCatIndex].items[itemIndex] = updatedItem;
      }
    } else {
      // Just update in place
      mockMenu[oldCatIndex].items[itemIndex] = updatedItem;
    }

    return updatedItem;
  },

  deleteItem: async (itemId: string): Promise<void> => {
    await delay(300);
    for (const cat of mockMenu) {
      const index = cat.items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        cat.items.splice(index, 1);
        return;
      }
    }
  },

  updateItemAvailability: async (itemId: string, available: boolean): Promise<MenuItem> => {
    return menuService.updateItem(itemId, { available });
  }
};
