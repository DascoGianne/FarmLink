import { getMe } from "../../api/me.js";
import { getBuyerById } from "../../api/buyers.js";
import { createOrder } from "../../api/orders.js";
import { getPricingByListing } from "../../api/listings.js";
import { getCart, saveCart, clearCart } from "../../api/cart.js";
import { updateBadges } from "../../api/badges.js";
import { hydrateBuyerSidebar } from "../../api/sidebar.js";
import API_BASE_URL from "../../api/config.js";

const orderItems = document.getElementById("orderItems");
const deliveryName = document.getElementById("deliveryName");
const deliveryAddress = document.getElementById("deliveryAddress");
const orderSubtotal = document.getElementById("orderSubtotal");
const deliveryFeeEl = document.getElementById("deliveryFee");
const orderTotal = document.getElementById("orderTotal");
const finishPaymentBtn = document.getElementById("finishPaymentBtn");
const deliveryOptions = document.querySelectorAll(".option");
const paymentButtons = document.querySelectorAll(".pay-btn");
const paymentContents = document.querySelectorAll(".payment-content");
const paymentStatus = document.getElementById("paymentStatus");

const FALLBACK_IMAGE = "/client/public/images/MAIN PAGE/Group 52489.png";

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
})();

let selectedDeliveryMethod = "";
let selectedDeliveryFee = 0;
let selectedPaymentMethod = "";
let cartCache = [];
let buyerProfile = null;

function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (/^\/?uploads\//.test(url)) {
    if (!API_ORIGIN) return url;
    const normalized = url.startsWith("/") ? url : `/${url}`;
    return `${API_ORIGIN}${normalized}`;
  }
  return url;
}

function parsePriceNumber(value) {
  if (value == null) return null;
  const num = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : null;
}

function formatCurrency(amount) {
  const value = Number(amount || 0);
  return value.toFixed(2);
}

function parseFee(text) {
  const match = String(text).match(/([0-9]+(?:\.[0-9]+)?)/g);
  if (!match || match.length === 0) return 0;
  return Number(match[match.length - 1]);
}

function computeSubtotal(cart) {
  return cart.reduce((sum, item) => {
    const price = parsePriceNumber(item.price) || 0;
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);
}

function updateTotals() {
  const subtotal = computeSubtotal(cartCache);
  if (orderSubtotal) orderSubtotal.textContent = formatCurrency(subtotal);
  if (deliveryFeeEl) deliveryFeeEl.textContent = formatCurrency(selectedDeliveryFee);
  if (orderTotal) orderTotal.textContent = formatCurrency(subtotal + selectedDeliveryFee);
}

async function hydrateCart(cart) {
  const updates = await Promise.all(
    cart.map(async (item) => {
      let next = { ...item };
      let changed = false;

      if (!parsePriceNumber(item.price)) {
        try {
          const pricingRes = await getPricingByListing(item.listing_id);
          const pricing = pricingRes.data || [];
          const firstPrice = pricing[0]?.price;
          if (parsePriceNumber(firstPrice)) {
            next.price = firstPrice;
            changed = true;
          }
        } catch (err) {
          console.warn("Failed to load pricing:", err);
        }
      }

      return { item: next, changed };
    })
  );

  const nextCart = updates.map((entry) => entry.item);
  if (updates.some((entry) => entry.changed)) {
    saveCart(nextCart);
  }
  return nextCart;
}

function renderOrders() {
  if (!orderItems) return;

  if (cartCache.length === 0) {
    orderItems.innerHTML = "<p>Your basket is empty.</p>";
    updateTotals();
    return;
  }

  orderItems.innerHTML = cartCache
    .map((item) => {
      const price = parsePriceNumber(item.price) || 0;
      const qty = Number(item.quantity || 0);
      const subtotal = price * qty;
      const imageUrl = resolveImageUrl(item.image_1) || FALLBACK_IMAGE;

      return `
        <div class="order-item">
          <img src="${imageUrl}" alt="${item.crop_name || "Order item"}">
          <div>
            <p class="item-name">${item.crop_name || "Item"}</p>
            <p>Qty: ${qty}</p>
            <p class="item-price">Price: ${formatCurrency(price)} | Subtotal: ${formatCurrency(subtotal)}</p>
          </div>
        </div>
      `;
    })
    .join("");

  updateTotals();
}

function setupDeliveryOptions() {
  deliveryOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      deliveryOptions.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");

      selectedDeliveryFee = parseFee(btn.textContent);
      selectedDeliveryMethod = btn.textContent.split("(")[0].trim();

      updateTotals();
    });
  });
}

function setupPaymentOptions() {
  paymentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      paymentButtons.forEach((item) => item.classList.remove("active"));
      paymentContents.forEach((content) => content.classList.remove("show"));

      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add("show");

      selectedPaymentMethod = btn.textContent.trim();
    });
  });

  const active = document.querySelector(".pay-btn.active");
  if (active) {
    selectedPaymentMethod = active.textContent.trim();
  }
}

async function loadBuyerProfile() {
  try {
    const me = await getMe();
    const buyerId = me?.user?.id;
    if (!buyerId) return null;

    const buyerRes = await getBuyerById(buyerId);
    const buyer = buyerRes.data || null;

    if (buyer) {
      if (deliveryName) {
        deliveryName.innerHTML = `<strong>${buyer.username || "Buyer"}</strong> (${buyer.contact_number || ""})`;
      }
      if (deliveryAddress) {
        deliveryAddress.textContent = [
          buyer.street_no,
          buyer.barangay,
          buyer.municipality_city,
          buyer.province,
          buyer.region,
        ]
          .filter(Boolean)
          .join(", ");
      }
    }

    return buyer;
  } catch (err) {
    console.error("Failed to load buyer profile:", err);
    return null;
  }
}

async function handleFinishOrder() {
  if (!finishPaymentBtn) return;

  finishPaymentBtn.disabled = true;

  if (cartCache.length === 0) {
    alert("Your basket is empty.");
    finishPaymentBtn.disabled = false;
    return;
  }

  if (!selectedDeliveryMethod) {
    alert("Please select a delivery method.");
    finishPaymentBtn.disabled = false;
    return;
  }

  if (!selectedPaymentMethod) {
    alert("Please select a payment method.");
    finishPaymentBtn.disabled = false;
    return;
  }

  buyerProfile = buyerProfile || (await loadBuyerProfile());
  if (!buyerProfile) {
    alert("Please log in to continue.");
    finishPaymentBtn.disabled = false;
    return;
  }

  const addressPayload = {
    region: buyerProfile.region || "",
    province: buyerProfile.province || "",
    municipality_city: buyerProfile.municipality_city || "",
    barangay: buyerProfile.barangay || "",
    street_no: buyerProfile.street_no || "",
  };

  try {
    let feeRemaining = Number(selectedDeliveryFee || 0);

    for (const item of cartCache) {
      const qty = Number(item.quantity || 0);
      const price = parsePriceNumber(item.price) || 0;
      const itemSubtotal = price * qty;
      const itemFee = feeRemaining > 0 ? feeRemaining : 0;
      const itemTotal = itemSubtotal + itemFee;

      feeRemaining = 0;

      await createOrder({
        ngo_id: item.ngo_id,
        listing_id: item.listing_id,
        quantity: qty,
        subtotal: itemSubtotal,
        delivery_fee: itemFee,
        total_amount: itemTotal,
        ...addressPayload,
      });
    }

    clearCart();
    cartCache = [];
    renderOrders();
    updateBadges();

    alert("Order placed successfully!");

    if (confirm("Go to My Deliveries?")) {
      window.location.href = "/client/views/layouts/Home page - Buyer/MyDeliveries.html";
    }
  } catch (err) {
    console.error("Order creation failed:", err);
    alert(err?.message || "Failed to place order.");
  } finally {
    finishPaymentBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("open");

  const searchInput = document.querySelector(".search-input");
  const menuItems = document.querySelectorAll("#sidebar-menu li");
  if (searchInput && menuItems.length) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      menuItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? "block" : "none";
      });
    });
  }

  try {
    await updateBadges();
    const topBasketBadge = document.getElementById("basketBadge");
    const topDeliveriesBadge = document.getElementById("deliveriesBadge");
    const sidebarBasketBadge = document.getElementById("sidebarBasketBadge");
    const sidebarDeliveriesBadge = document.getElementById("sidebarDeliveriesBadge");

    if (sidebarBasketBadge && topBasketBadge) {
      sidebarBasketBadge.textContent = topBasketBadge.textContent || "0";
    }
    if (sidebarDeliveriesBadge && topDeliveriesBadge) {
      sidebarDeliveriesBadge.textContent = topDeliveriesBadge.textContent || "0";
    }
  } catch (err) {
    console.warn("Badge update failed:", err);
  }

  await hydrateBuyerSidebar();

  if (paymentStatus) paymentStatus.textContent = "Status: Pending";

  setupDeliveryOptions();
  setupPaymentOptions();

  buyerProfile = await loadBuyerProfile();

  cartCache = await hydrateCart(getCart());
  renderOrders();

  if (finishPaymentBtn) {
    finishPaymentBtn.addEventListener("click", handleFinishOrder);
  }
});

document.querySelectorAll(".upload-box input[type=\"file\"]").forEach((input) => {
  input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      this.value = "";
      return;
    }

    const preview = this.parentElement.querySelector(".receipt-preview");
    const text = this.parentElement.querySelector("span");

    if (preview) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
    if (text) text.style.display = "none";
  });
});
