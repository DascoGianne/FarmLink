import { getToken } from "./token.js";
import { getMe } from "./me.js";
import { getAuthJson } from "./http.js";

// Cart key (adjust if your cart uses a different key)
const CART_KEY = "farmlink_cart";

// Basket count (localStorage)
function getBasketCount() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return 0;

    const items = JSON.parse(raw);

    // supports: [{ qty: 2 }, ...] or [{ quantity: 2 }, ...]
    if (Array.isArray(items)) {
      return items.reduce((sum, item) => {
        const q = Number(item.qty ?? item.quantity ?? 1);
        return sum + (Number.isFinite(q) ? q : 0);
      }, 0);
    }

    return 0;
  } catch {
    return 0;
  }
}

// Deliveries count (API)
async function getDeliveriesCount() {
  const token = getToken();
  if (!token) return 0;

  const me = await getMe();

  // Only buyers have deliveries list in your UI badge
  if (me?.user?.role !== "BUYER") return 0;

  const buyerId = me.user.id;
  const res = await getAuthJson(`/orders/buyer/${buyerId}`);

  const orders = res.data || [];

  // Count active orders only
  const active = orders.filter((o) => {
    const s = (o.order_status || "").toLowerCase();
    return s !== "completed" && s !== "cancelled";
  });

  return active.length;
}

// Update DOM badges
export async function updateBadges() {
  // Basket
  const basketBadge = document.getElementById("basketBadge");
  if (basketBadge) {
    const basketCount = getBasketCount();
    basketBadge.textContent = basketCount;

    // Hide badge if 0 (optional)
    basketBadge.style.display = basketCount > 0 ? "inline-flex" : "none";
  }

  // Deliveries
  const deliveriesBadge = document.getElementById("deliveriesBadge");
  if (deliveriesBadge) {
    try {
      const deliveriesCount = await getDeliveriesCount();
      deliveriesBadge.textContent = deliveriesCount;
      deliveriesBadge.style.display =
        deliveriesCount > 0 ? "inline-flex" : "none";
    } catch (e) {
      // If API fails, just hide deliveries badge
      deliveriesBadge.style.display = "none";
      console.warn("Deliveries badge update failed:", e);
    }
  }
}
