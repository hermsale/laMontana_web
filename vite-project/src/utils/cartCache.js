const cacheKeyForUser = (user) => {
  if (user?.id) return `lm_cart_cache:${user.id}`;
  if (user?.email) return `lm_cart_cache:${user.email}`;
  return null;
};

const readCartCache = (user) => {
  const key = cacheKeyForUser(user);
  if (!key) return { items: [], cartId: null };
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { items: [], cartId: null };
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    const cartId = typeof parsed?.cartId === "string" ? parsed.cartId : null;
    return { items, cartId };
  } catch {
    return { items: [], cartId: null };
  }
};

const writeCartCache = (user, items = [], cartId = null) => {
  const key = cacheKeyForUser(user);
  if (!key) return;
  const payload = {
    items: Array.isArray(items) ? items : [],
    cartId: typeof cartId === "string" ? cartId : null,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(payload));
};

const clearCartCache = (user) => {
  const key = cacheKeyForUser(user);
  if (!key) return;
  localStorage.removeItem(key);
};

export { readCartCache, writeCartCache, clearCartCache };
