const API_BASE = "http://localhost:2006/api";

export const authAPI = {
  signup: async ({ email, password, full_name, role, outlet_name }) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name, role, outlet_name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    return data;
  },

  signin: async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign in failed");
    return data;
  },

  getProfile: async (userId) => {
    const res = await fetch(`${API_BASE}/auth/profile/${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
    return data;
  },
};

export const foodAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.outlet_name) params.set("outlet_name", filters.outlet_name);
    if (filters.available !== undefined) params.set("available", filters.available);

    const res = await fetch(`${API_BASE}/food?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch menu items");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/food/${id}`);
    if (!res.ok) throw new Error("Failed to fetch food item");
    return res.json();
  },

  add: async (foodData) => {
    const res = await fetch(`${API_BASE}/food/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData),
    });
    if (!res.ok) throw new Error("Failed to add food item");
    return res.json();
  },

  update: async (id, foodData) => {
    const res = await fetch(`${API_BASE}/food/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData),
    });
    if (!res.ok) throw new Error("Failed to update food item");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/food/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete food item");
    return res.json();
  },
};

export const orderAPI = {
  create: async (orderData) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
  },

  createPaymentOrder: async (amount) => {
    const res = await fetch(`${API_BASE}/orders/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create payment order");
    return data;
  },

  verifyPaymentAndCreateOrder: async (payload) => {
    const res = await fetch(`${API_BASE}/orders/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to verify payment");
    return data;
  },

  getByUser: async (userId) => {
    const res = await fetch(`${API_BASE}/orders/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  getAll: async (status = "") => {
    const params = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE}/orders/all${params}`);
    if (!res.ok) throw new Error("Failed to fetch all orders");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/orders/single/${id}`);
    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return res.json();
  },
};
