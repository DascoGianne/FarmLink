import { getMe } from "../api/me.js";
import { getBuyerById } from "../api/buyers.js";
import { createOrder } from "../api/orders.js";
import { getPricingByListing, getTraceabilityByListing } from "../api/listings.js";
import API_BASE_URL from "../api/config.js";
import { getCart, saveCart, updateCartQuantity, removeFromCart, clearCart } from "../api/cart.js";
import { updateBadges } from "../api/badges.js";


const basketItems = document.getElementById("basketItems");
const totalAmount = document.getElementById("totalAmount");
const checkoutBtn = document.getElementById("checkoutBtn");
const basketCount = document.getElementById("basketCount");

const FALLBACK_PRODUCT_IMAGE = "/client/public/images/My Basket/Orange.png";

const API_ORIGIN = (() => {
    try {
        return new URL(API_BASE_URL).origin;
    } catch (err) {
        return "";
    }
})();

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

function formatPrice(value) {
    const num = parsePriceNumber(value);
    return num == null ? "0.00" : num.toFixed(2);
}

function computeTotal(cart) {
    return cart.reduce((sum, item) => {
        const price = parsePriceNumber(item.price) || 0;
        const qty = Number(item.quantity || 0);
        return sum + price * qty;
    }, 0);
}

function computeBasketCount(cart) {
    return cart.length;
}

function setBasketCount(cart) {
    if (!basketCount) return;
    basketCount.textContent = String(computeBasketCount(cart));
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

            if (!item.farm_address) {
                try {
                    const traceRes = await getTraceabilityByListing(item.listing_id);
                    const trace = traceRes.data || {};
                    if (trace.farm_address) {
                        next.farm_address = trace.farm_address;
                        changed = true;
                    }
                } catch (err) {
                    console.warn("Failed to load farm address:", err);
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

async function renderCart() {
    let cart = getCart();

    if (!basketItems) return;

    if (cart.length === 0) {
        basketItems.innerHTML = "<p>Your basket is empty.</p>";
        if (totalAmount) totalAmount.textContent = "0.00";
        setBasketCount(cart);
        updateBadges();
        return;
    }

    cart = await hydrateCart(cart);
    setBasketCount(cart);

    basketItems.innerHTML = cart.map((item) => {
        const unitPrice = parsePriceNumber(item.price) || 0;
        return `
        <div class="product-card" data-listing-id="${item.listing_id}" data-unit-price="${unitPrice}">
            <img src="${resolveImageUrl(item.image_1) || FALLBACK_PRODUCT_IMAGE}" class="product-img">
            <div class="product-info">
                <h3>${item.crop_name}</h3>
                <p class="location">${item.farm_address || item.category || ""}</p>
                <p class="price">${formatPrice(unitPrice * Number(item.quantity || 0))}</p>
            </div>
            <div class="qty-controls">
                <img src="/client/public/images/My Basket/Minus of the same Product.png" class="minus-btn">
                <span class="qty">${item.quantity}</span>
                <img src="/client/public/images/My Basket/Add More of the same Product.png" class="add-btn">
            </div>
        </div>
    `;
    }).join("");

    basketItems.querySelectorAll(".product-card").forEach((card) => {
        const listingId = Number(card.dataset.listingId);
        const qtySpan = card.querySelector(".qty");
        const priceEl = card.querySelector(".price");
        const unitPrice = parsePriceNumber(card.dataset.unitPrice) || 0;
        const minusBtn = card.querySelector(".minus-btn");
        const addBtn = card.querySelector(".add-btn");

        minusBtn.addEventListener("click", () => {
            const cart = getCart();
            const item = cart.find((entry) => entry.listing_id === listingId);
            if (!item) return;

            if (item.quantity <= 1) {
                removeFromCart(listingId);
                renderCart();
                return;
            }

            const nextQty = item.quantity - 1;
            updateCartQuantity(listingId, nextQty);
            qtySpan.textContent = nextQty;
            if (priceEl) priceEl.textContent = formatPrice(unitPrice * nextQty);
            setBasketCount(getCart());
            if (totalAmount) totalAmount.textContent = computeTotal(getCart()).toFixed(2);
            updateBadges();
        });

        addBtn.addEventListener("click", () => {
            const cart = getCart();
            const item = cart.find((entry) => entry.listing_id === listingId);
            if (!item) return;

            const nextQty = item.quantity + 1;
            updateCartQuantity(listingId, nextQty);
            qtySpan.textContent = nextQty;
            if (priceEl) priceEl.textContent = formatPrice(unitPrice * nextQty);
            setBasketCount(getCart());
            if (totalAmount) totalAmount.textContent = computeTotal(getCart()).toFixed(2);
            updateBadges();
        });
    });

    if (totalAmount) totalAmount.textContent = computeTotal(cart).toFixed(2);
    setBasketCount(cart);
    updateBadges();
}

async function handleCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your basket is empty.");
        return;
    }

    checkoutBtn.disabled = true;

    try {
        const me = await getMe();
        const buyerId = me?.user?.id;

        if (!buyerId) {
            alert("Please log in again.");
            return;
        }

        const buyerRes = await getBuyerById(buyerId);
        const buyer = buyerRes.data || {};

        const orders = cart.map((item) => createOrder({
            buyer_id: buyerId,
            ngo_id: item.ngo_id,
            listing_id: item.listing_id,
            quantity: item.quantity,
            subtotal: Number(item.price || 0) * item.quantity,
            delivery_fee: 0,
            total_amount: Number(item.price || 0) * item.quantity,
            region: buyer.region || "",
            province: buyer.province || "",
            municipality_city: buyer.municipality_city || "",
            barangay: buyer.barangay || "",
            street_no: buyer.street_no || "",
        }));

        await Promise.all(orders);
        clearCart();
        renderCart();
        alert("Order placed successfully.");
        window.location.href = "./MyDeliveries.html";
    } catch (err) {
        console.error("Checkout error:", err);
        alert(err?.message || "Failed to place order.");
    } finally {
        checkoutBtn.disabled = false;
    }
}

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
}

renderCart();
