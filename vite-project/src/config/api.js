// encapsulamos la URL base de la API en una constante para facilitar su uso en otros módulos
// de esta manera, si a futuro hay que hacer un cambio, solo se modifica en este archivo
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";