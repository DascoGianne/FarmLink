import { getMe } from "../api/me.js";
import { getBuyerById } from "../api/buyers.js";
import { createOrder } from "../api/orders.js";
import { getCart, updateCartQuantity, removeFromCart, clearCart } from "../api/cart.js";


const basketItems = document.getElementById("basketItems");
const totalAmount = document.getElementById("totalAmount");
const checkoutBtn = document.getElementById("checkoutBtn");

function computeTotal(cart) {
    return cart.reduce((sum, item) => {
        const price = Number(item.price || 0);
        return sum + price * item.quantity;
    }, 0);
}

function renderCart() {
    const cart = getCart();

    if (!basketItems) return;

    if (cart.length === 0) {
        basketItems.innerHTML = "<p>Your basket is empty.</p>";
        if (totalAmount) totalAmount.textContent = "0.00";
        return;
    }

    basketItems.innerHTML = cart.map((item) => `
        <div class="product-card" data-listing-id="${item.listing_id}">
            <img src="${item.image_1 || "/client/public/images/My Basket/Orange.png"}" class="product-img">
            <div class="product-info">
                <h3>${item.crop_name}</h3>
                <p class="location">${item.category || ""}</p>
                <p class="price">${item.price ? item.price : "N/A"}</p>
            </div>
            <div class="qty-controls">
                <img src="/client/public/images/My Basket/Minus of the same Product.png" class="minus-btn">
                <span class="qty">${item.quantity}</span>
                <img src="/client/public/images/My Basket/Add More of the same Product.png" class="add-btn">
            </div>
        </div>
    `).join("");

    basketItems.querySelectorAll(".product-card").forEach((card) => {
        const listingId = Number(card.dataset.listingId);
        const qtySpan = card.querySelector(".qty");
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
            if (totalAmount) totalAmount.textContent = computeTotal(getCart()).toFixed(2);
        });

        addBtn.addEventListener("click", () => {
            const cart = getCart();
            const item = cart.find((entry) => entry.listing_id === listingId);
            if (!item) return;

            const nextQty = item.quantity + 1;
            updateCartQuantity(listingId, nextQty);
            qtySpan.textContent = nextQty;
            if (totalAmount) totalAmount.textContent = computeTotal(getCart()).toFixed(2);
        });
    });

    if (totalAmount) totalAmount.textContent = computeTotal(cart).toFixed(2);
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
