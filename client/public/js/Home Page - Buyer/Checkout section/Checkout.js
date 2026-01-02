import { getMe } from "../../api/me.js";
import { getBuyerById } from "../../api/buyers.js";
import { getOrdersByBuyer } from "../../api/orders.js";
import { createPayment, getPaymentByOrder } from "../../api/payments.js";

//loader
window.onload = function() {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    // Optional: wait a bit before starting animation
    setTimeout(() => {
        loader.classList.add("done");

        // Wait for CSS transition to finish
        setTimeout(() => {
            loader.style.display = "none"; 
            content.classList.add("show");
        }, 600); 
    }, 1000); // 1 second delay for demo
};



// Sidebar
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.querySelector('.sidebar-toggle-btn'); // changed
const closeBtn = document.querySelector('.sidebar-close');

sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
});



// Sidebar search functionality
const searchInput = document.querySelector('.search-input');
const menuItems = document.querySelectorAll('#sidebar-menu li');

searchInput.addEventListener('input', function () {
    let filter = searchInput.value.toLowerCase();

    menuItems.forEach(item => {
        let text = item.textContent.toLowerCase();

        if (text.includes(filter)) {
            item.style.display = "block";   
        } else {
            item.style.display = "none"; 
        }
    });
});


//payment
const buttons = document.querySelectorAll('.pay-btn');
const contents = document.querySelectorAll('.payment-content');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active state
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('show'));

        // Activate selected
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('show');
    });
});

document.querySelectorAll('.upload-box input[type="file"]').forEach(input => {
    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            this.value = '';
            return;
        }

        const preview = this.parentElement.querySelector('.receipt-preview');
        const text = this.parentElement.querySelector('span');

        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        text.style.display = 'none';
    });
});

const orderItems = document.getElementById("orderItems");
const deliveryName = document.getElementById("deliveryName");
const deliveryAddress = document.getElementById("deliveryAddress");
const paymentStatus = document.getElementById("paymentStatus");
const orderSubtotal = document.getElementById("orderSubtotal");
const deliveryFeeEl = document.getElementById("deliveryFee");
const finishPaymentBtn = document.getElementById("finishPaymentBtn");
const deliveryOptions = document.querySelectorAll(".option");

function getActivePaymentMethod() {
    const active = document.querySelector(".pay-btn.active");
    if (!active) return "Cash On Delivery";
    if (active.dataset.target === "ewallet") return "E-Wallet";
    if (active.dataset.target === "bank") return "Bank Transfer";
    return "Cash On Delivery";
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

function getDeliveryStorageKey(orderId) {
    return `farmlink_delivery_${orderId}`;
}

function applyDeliverySelection(orderId, baseAmount) {
    let selectedFee = 0;
    let selectedMethod = "";

    const stored = localStorage.getItem(getDeliveryStorageKey(orderId));
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            selectedFee = Number(parsed.fee || 0);
            selectedMethod = parsed.method || "";
        } catch {
            selectedFee = 0;
        }
    }

    if (deliveryOptions.length > 0) {
        deliveryOptions.forEach((btn) => {
            const fee = parseFee(btn.textContent);
            const isMatch = selectedMethod && btn.textContent.includes(selectedMethod);
            const isFeeMatch = selectedFee && fee === selectedFee;
            if (isMatch || isFeeMatch) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        if (!selectedMethod) {
            const first = deliveryOptions[0];
            selectedFee = parseFee(first.textContent);
            selectedMethod = first.textContent.split("(")[0].trim();
            first.classList.add("active");
            localStorage.setItem(
                getDeliveryStorageKey(orderId),
                JSON.stringify({ method: selectedMethod, fee: selectedFee })
            );
        }
    }

    if (deliveryFeeEl) deliveryFeeEl.textContent = formatCurrency(selectedFee);
    if (orderSubtotal) orderSubtotal.textContent = formatCurrency(baseAmount + selectedFee);

    return { fee: selectedFee, method: selectedMethod };
}

async function loadCheckout() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
        if (orderItems) orderItems.innerHTML = "<p>Missing order_id.</p>";
        return;
    }

    try {
        const me = await getMe();
        const buyerId = me?.user?.id;
        if (!buyerId) {
            if (orderItems) orderItems.innerHTML = "<p>Please log in to continue.</p>";
            return;
        }

        const [buyerRes, ordersRes] = await Promise.all([
            getBuyerById(buyerId),
            getOrdersByBuyer(buyerId),
        ]);

        const buyer = buyerRes.data || {};
        const orders = ordersRes.data || [];
        const order = orders.find((entry) => String(entry.order_id) === String(orderId));

        if (!order) {
            if (orderItems) orderItems.innerHTML = "<p>Order not found.</p>";
            return;
        }

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
            ].filter(Boolean).join(", ");
        }

        if (orderItems) {
            orderItems.innerHTML = `
                <div class="order-item">
                    <img src="${order.image_1 || "/client/public/images/MAIN PAGE/Group 52489.png"}">
                    <div>
                        <p class="item-name">${order.crop_name}</p>
                        <p class="item-price">${formatCurrency(order.total_amount)}</p>
                    </div>
                </div>
            `;
        }

        const baseAmount = Number(order.total_amount || 0);
        const deliverySelection = applyDeliverySelection(order.order_id, baseAmount);

        try {
            const paymentRes = await getPaymentByOrder(order.order_id);
            const payment = paymentRes.data;
            if (paymentStatus && payment?.payment_status) {
                paymentStatus.textContent = `Status: ${payment.payment_status}`;
            }
            if (finishPaymentBtn) {
                finishPaymentBtn.disabled = true;
                finishPaymentBtn.textContent = "Payment Recorded";
            }
        } catch (err) {
            if (paymentStatus) paymentStatus.textContent = "Status: Pending";
        }

        if (finishPaymentBtn) {
            finishPaymentBtn.addEventListener("click", async () => {
                finishPaymentBtn.disabled = true;

                try {
                    const method = getActivePaymentMethod();
                    const status = method === "Cash On Delivery" ? "Unpaid" : "Paid";

                    await createPayment({
                        order_id: order.order_id,
                        payment_method: method,
                        amount_paid: baseAmount + Number(deliverySelection.fee || 0),
                        payment_status: status,
                    });

                    if (paymentStatus) paymentStatus.textContent = `Status: ${status}`;
                    finishPaymentBtn.textContent = "Payment Recorded";
                } catch (err) {
                    console.error("Payment error:", err);
                    alert(err?.message || "Failed to record payment.");
                    finishPaymentBtn.disabled = false;
                }
            }, { once: true });
        }
    } catch (err) {
        console.error("Checkout load error:", err);
        if (orderItems) orderItems.innerHTML = "<p>Failed to load order.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadCheckout);

deliveryOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
        deliveryOptions.forEach((item) => item.classList.remove("active"));
        btn.classList.add("active");

        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("order_id");
        if (!orderId) return;

        const fee = parseFee(btn.textContent);
        const method = btn.textContent.split("(")[0].trim();
        localStorage.setItem(
            getDeliveryStorageKey(orderId),
            JSON.stringify({ method, fee })
        );

        const subtotalValue = Number(orderSubtotal?.textContent || 0);
        const baseAmount = subtotalValue - Number(deliveryFeeEl?.textContent || 0);

        if (deliveryFeeEl) deliveryFeeEl.textContent = formatCurrency(fee);
        if (orderSubtotal) orderSubtotal.textContent = formatCurrency(baseAmount + fee);
    });
});


