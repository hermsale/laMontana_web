import { API_BASE } from "../config/api.js";

const fetchJson = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg = data.error || data.mensaje || "Error al comunicarse con la API";
    const err = new Error(msg);
    if (data.detalles) err.detalles = data.detalles;
    throw err;
  }

  return data;
};

export const authApi = {
  login: (email, password) =>
    fetchJson("/usuarios/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload) =>
    fetchJson("/usuarios", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  google: (idToken) =>
    fetchJson("/usuarios/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  logout: () =>
    fetchJson("/usuarios/logout", {
      method: "POST",
    }),

  getUser: (id) => fetchJson(`/usuarios/${id}`),

  update: (id, payload) =>
    fetchJson(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
