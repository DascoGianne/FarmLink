import { getMe } from "../api/me.js";
import { getOrdersByBuyer } from "../api/orders.js";
import { getPaymentByOrder } from "../api/payments.js";
import { getLogisticsByOrder } from "../api/logistics.js";
import { updateBadges } from "../api/badges.js";

//loader
window.onload = function() {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    setTimeout(() => {
        loader.classList.add("done");

        setTimeout(() => {
            loader.style.display = "none"; 
            content.classList.add("show");
        }, 600); 
    }, 1000);
};


// Sidebar
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.querySelector('#top .left-group img');
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

const ordersList = document.getElementById("ordersList");

function getStatusIcon(status) {
    const base = "/client/public/images/My Deliveries (Hard coded lang)";
    if (status === "Delivering") {
        return `${base}/Order In Transit Icon.png`;
    }
    return `${base}/Order Confirmed Icon.png`;
}

function getStatusClass(status) {
    if (status === "Delivering") return "In-Transit";
    return "comfirm";
}

async function loadOrders() {
    if (!ordersList) return;

    try {
        const me = await getMe();
        const buyerId = me?.user?.id;

        if (!buyerId) {
            ordersList.innerHTML = "<p>Please log in to view orders.</p>";
            return;
        }

        const res = await getOrdersByBuyer(buyerId);
        const orders = res.data || [];

        if (orders.length === 0) {
            ordersList.innerHTML = "<p>No orders yet.</p>";
            return;
        }

        const paymentStatuses = await Promise.all(
            orders.map(async (order) => {
                try {
                    const paymentRes = await getPaymentByOrder(order.order_id);
                    return paymentRes.data?.payment_status || "Pending";
                } catch {
                    return "Pending";
                }
            })
        );

        const logisticsStatuses = await Promise.all(
            orders.map(async (order) => {
                try {
                    const logisticsRes = await getLogisticsByOrder(order.order_id);
                    return logisticsRes.data || null;
                } catch {
                    return null;
                }
            })
        );

        ordersList.innerHTML = orders.map((order, index) => {
            let deliveryMethod = "Not selected";
            try {
                const stored = localStorage.getItem(`farmlink_delivery_${order.order_id}`);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.method) deliveryMethod = parsed.method;
                }
            } catch {}

            return `
            <div class="delivery-item-container">
                <div class="${getStatusClass(order.order_status)}">
                    <img src="/client/public/images/My Account/Defaut Profile Picture.png" class="profile icon">
                    <div class="text-group">
                        <h3 class="name">${order.ngo_name || "NGO"}</h3>
                        <p>${order.crop_name} (${order.quantity})</p>
                    </div>
                    <img src="${getStatusIcon(order.order_status)}" class="delivery-icon">
                </div>
                <div class="comment">
                    <img src="/client/public/images/My Account/Defaut Profile Picture.png" class="profile-message">
                    <div class="text-content">
                        <h3>${order.ngo_name || "NGO"}</h3>
                        <p>Status: ${order.order_status} | Payment: ${paymentStatuses[index]}</p>
                        <p>Delivery: ${logisticsStatuses[index]?.delivery_status || "Pending"}</p>
                        <p>Method: ${deliveryMethod}</p>
                        <a href="/client/views/layouts/Home page - Buyer/Checkout section/Checkout.html?order_id=${order.order_id}">Pay now</a>
                    </div>
                </div>
            </div>
        `;
        }).join("");
    } catch (err) {
        console.error("Failed to load orders:", err);
        ordersList.innerHTML = "<p>Failed to load orders.</p>";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await updateBadges();
    await loadOrders();
});

