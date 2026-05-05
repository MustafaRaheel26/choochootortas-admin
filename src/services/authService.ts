/**
 * Auth Service - Admin Login
 */

const API_BASE_URL = "https://choochootortas-backend.onrender.com/api";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      role: string;
    };
  };
}

// Admin login
export async function adminLogin(
  password: string,
): Promise<{ token: string; user: any }> {
  console.log("Attempting login...");

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  console.log("Login response:", data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Login failed");
  }

  // Store token in localStorage
  localStorage.setItem("admin_token", data.data.token);
  localStorage.setItem("admin_user", JSON.stringify(data.data.user));

  console.log("Token stored:", data.data.token.substring(0, 50) + "...");

  return {
    token: data.data.token,
    user: data.data.user,
  };
}

// Admin logout
export function adminLogout(): void {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  console.log("Logged out, token removed");
}

// Check if admin is logged in
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("admin_token");
  console.log("isAuthenticated check:", !!token);
  return !!token;
}

// Get current admin user
export function getCurrentUser(): any {
  const userStr = localStorage.getItem("admin_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
