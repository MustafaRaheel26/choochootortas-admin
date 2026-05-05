/**
 * Menu Service - Connected to Backend API
 */

const API_BASE_URL = "https://choochootortas-backend.onrender.com/api";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

// ==================== MENU TYPES ====================

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

// ==================== MENU API ====================

// Get all menu items (grouped by category)
export async function getMenu(): Promise<MenuCategory[]> {
  const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
  const categoriesData = await categoriesRes.json();
  const categories = categoriesData.data;

  const menuRes = await fetch(`${API_BASE_URL}/menu`);
  const menuData = await menuRes.json();
  const allItems = menuData.data;

  const menuWithCategories: MenuCategory[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    items: allItems.filter((item: MenuItem) => item.categoryId === cat.id),
  }));

  return menuWithCategories;
}

// Add menu item (requires auth)
export async function addMenuItem(
  categoryId: string,
  item: Omit<MenuItem, "id">,
): Promise<MenuItem> {
  const token = getAuthToken();

  console.log("🔍 ========== ADD MENU ITEM ==========");
  console.log("🔍 Category ID:", categoryId);
  console.log("🔍 Item data:", item);
  console.log("🔍 Token exists:", !!token);

  const requestBody = {
    itemName: item.itemName,
    price: item.price,
    description: item.description || "",
    ingredients: item.ingredients || [],
    removeOptions: item.removeOptions || [],
    extras: item.extras || [],
    categoryId: categoryId,
    available: item.available !== undefined ? item.available : true,
    isBestseller: item.isBestseller || false,
    image: item.image || "",
  };

  console.log(
    "🔍 Request body being sent:",
    JSON.stringify(requestBody, null, 2),
  );

  const response = await fetch(`${API_BASE_URL}/menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  console.log("🔍 Response status:", response.status);

  const data = await response.json();
  console.log("🔍 Response data:", data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to add menu item");
  }

  return data.data;
}

// Update menu item (requires auth)
export async function updateMenuItem(
  itemId: string,
  updates: Partial<MenuItem>,
): Promise<MenuItem> {
  const token = getAuthToken();

  console.log("🔍 ========== UPDATE MENU ITEM ==========");
  console.log("🔍 Item ID:", itemId);
  console.log("🔍 Updates:", updates);

  const response = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  console.log("🔍 Response status:", response.status);

  const data = await response.json();
  console.log("🔍 Response data:", data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to update menu item");
  }

  return data.data;
}

// Delete menu item (requires auth)
export async function deleteMenuItem(itemId: string): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to delete menu item");
  }
}

// Toggle item availability (requires auth)
export async function toggleItemAvailability(
  itemId: string,
  available: boolean,
): Promise<MenuItem> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/menu/${itemId}/availability`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ available }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to toggle availability");
  }

  return data.data;
}

// Add category (requires auth)
export async function addCategory(
  name: string,
): Promise<{ id: string; name: string }> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to add category");
  }

  return data.data;
}

// Delete category (requires auth)
export async function deleteCategory(id: string): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to delete category");
  }
}
