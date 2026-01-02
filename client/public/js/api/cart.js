const CART_KEY = "farmlink_cart";

export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((entry) => entry.listing_id === item.listing_id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(listingId, quantity) {
  const cart = getCart();
  const next = cart.map((entry) =>
    entry.listing_id === listingId ? { ...entry, quantity } : entry
  );
  saveCart(next);
  return next;
}

export function removeFromCart(listingId) {
  const cart = getCart().filter((entry) => entry.listing_id !== listingId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
