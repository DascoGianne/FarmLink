import { getMe } from "../api/me.js";
import { clearToken } from "../api/token.js";
import { getOrdersByNgo, updateOrderStatus } from "../api/orders.js";
import { createLogistics, getLogisticsByOrder, updateLogisticsByOrder } from "../api/logistics.js";

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

const ngoOrdersList = document.getElementById("ngoOrdersList");

function renderLogisticsForm(order, logistics) {
    const method = logistics?.delivery_method || "";
    const status = logistics?.delivery_status || "Preparing";
    const eta = logistics?.estimated_arrival ? String(logistics.estimated_arrival).slice(0, 10) : "";
    const delivered = logistics?.delivery_date ? String(logistics.delivery_date).slice(0, 10) : "";

    return `
        <div class="delivery-item-container">
            <div class="comfirm">
                <img src="/client/public/images/My Account/Defaut Profile Picture.png" class="profile icon">
                <div class="text-group">
                    <h3 class="name">${order.username || "Buyer"}</h3>
                    <p>Contact: ${order.contact_number || "N/A"}</p>
                    <p>${order.crop_name} (${order.quantity})</p>
                    <p>Status: ${order.order_status}</p>
                </div>
            </div>
            <div class="comment">
                <div class="text-content">
                    <label>Delivery Method</label>
                    <input type="text" class="logistics-method" value="${method}">

                    <label>Delivery Status</label>
                    <select class="logistics-status">
                        <option value="Preparing" ${status === "Preparing" ? "selected" : ""}>Preparing</option>
                        <option value="Out for Delivery" ${status === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>
                        <option value="Delivered" ${status === "Delivered" ? "selected" : ""}>Delivered</option>
                    </select>

                    <label>Estimated Arrival</label>
                    <input type="date" class="logistics-eta" value="${eta}">

                    <label>Delivery Date</label>
                    <input type="date" class="logistics-date" value="${delivered}">

                    <div class="order-status-actions">
                        <button class="order-status-btn" data-order-id="${order.order_id}" data-status="Confirmed">Confirm</button>
                        <button class="order-status-btn" data-order-id="${order.order_id}" data-status="Delivering">Delivering</button>
                        <button class="order-status-btn" data-order-id="${order.order_id}" data-status="Completed">Completed</button>
                    </div>

                    <button class="save-logistics-btn" data-order-id="${order.order_id}">Save Logistics</button>
                </div>
            </div>
        </div>
    `;
}

async function loadNgoOrders() {
    if (!ngoOrdersList) return;

    try {
        const me = await getMe();
        if (me?.user?.role !== "NGO") {
            clearToken();
            window.location.href = "/client/views/layouts/login.html";
            return;
        }
        const ngoId = me?.user?.id;

        if (!ngoId) {
            ngoOrdersList.innerHTML = "<p>Please log in to view deliveries.</p>";
            return;
        }

        const ordersRes = await getOrdersByNgo(ngoId);
        const orders = ordersRes.data || [];

        if (orders.length === 0) {
            ngoOrdersList.innerHTML = "<p>No orders yet.</p>";
            return;
        }

        const logistics = await Promise.all(
            orders.map(async (order) => {
                try {
                    const res = await getLogisticsByOrder(order.order_id);
                    return res.data || null;
                } catch {
                    return null;
                }
            })
        );

        ngoOrdersList.innerHTML = orders
            .map((order, index) => renderLogisticsForm(order, logistics[index]))
            .join("");

        ngoOrdersList.querySelectorAll(".order-status-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const orderId = btn.dataset.orderId;
                const status = btn.dataset.status;
                btn.disabled = true;

                try {
                    await updateOrderStatus(orderId, status);
                    btn.textContent = "Updated";
                    setTimeout(() => {
                        btn.textContent = status;
                        btn.disabled = false;
                    }, 1200);
                    await loadNgoOrders();
                } catch (err) {
                    console.error("Order status update error:", err);
                    alert(err?.message || "Failed to update order status.");
                    btn.disabled = false;
                }
            });
        });

        ngoOrdersList.querySelectorAll(".save-logistics-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const orderId = btn.dataset.orderId;
                const container = btn.closest(".delivery-item-container");
                const method = container.querySelector(".logistics-method").value.trim();
                const status = container.querySelector(".logistics-status").value;
                const eta = container.querySelector(".logistics-eta").value;
                const delivered = container.querySelector(".logistics-date").value;

                btn.disabled = true;

                try {
                    const payload = {
                        order_id: Number(orderId),
                        ngo_id: ngoId,
                        delivery_method: method || "Courier",
                        delivery_status: status,
                        estimated_arrival: eta || null,
                        delivery_date: delivered || null,
                    };

                    let existing = null;
                    try {
                        const res = await getLogisticsByOrder(orderId);
                        existing = res.data;
                    } catch {
                        existing = null;
                    }

                    if (existing) {
                        await updateLogisticsByOrder(orderId, {
                            delivery_status: status,
                            estimated_arrival: eta || null,
                            delivery_date: delivered || null,
                        });
                    } else {
                        await createLogistics(payload);
                    }

                    btn.textContent = "Saved";
                    setTimeout(() => {
                        btn.textContent = "Save Logistics";
                        btn.disabled = false;
                    }, 1200);
                } catch (err) {
                    console.error("Logistics update error:", err);
                    alert(err?.message || "Failed to save logistics.");
                    btn.disabled = false;
                }
            });
        });
    } catch (err) {
        console.error("Failed to load NGO deliveries:", err);
        ngoOrdersList.innerHTML = "<p>Failed to load deliveries.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadNgoOrders);

