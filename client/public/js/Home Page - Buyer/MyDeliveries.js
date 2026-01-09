import { getMe } from "../api/me.js";
import { getOrdersByBuyer } from "../api/orders.js";
import { getPaymentByOrder } from "../api/payments.js";
import { getLogisticsByOrder } from "../api/logistics.js";
import { updateBadges } from "../api/badges.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ================= SIDEBAR (always open) =================
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("open");

  // Sidebar menu search (Marketplace-style)
  const sidebarSearch = document.getElementById("sidebarSearch");
  const menuItems = document.querySelectorAll("#sidebar-menu li");

  if (sidebarSearch && menuItems.length) {
    sidebarSearch.addEventListener("input", () => {
      const filter = sidebarSearch.value.toLowerCase().trim();
      menuItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? "flex" : "none";
      });
    });
  }

  // ================= BADGES =================
  await updateBadges();

  const topBasketBadge = document.getElementById("basketBadge");
  const topDeliveriesBadge = document.getElementById("deliveriesBadge");
  const sidebarBasketBadge = document.getElementById("sidebarBasketBadge");
  const sidebarDeliveriesBadge = document.getElementById("sidebarDeliveriesBadge");

  const mirrorBadgesToSidebar = () => {
    if (sidebarBasketBadge && topBasketBadge) {
      sidebarBasketBadge.textContent = topBasketBadge.textContent || "0";
    }
    if (sidebarDeliveriesBadge && topDeliveriesBadge) {
      sidebarDeliveriesBadge.textContent = topDeliveriesBadge.textContent || "0";
    }
  };

  mirrorBadgesToSidebar();

  // ================= DELIVERIES =================
  const ordersList = document.getElementById("ordersList");

  // ---- ICONS for the tracker (adjust file names if needed)
  const ICON_BASE = "/client/public/images/My Deliveries (Hard coded lang)";
  const ICON_CONFIRMED = `${ICON_BASE}/Order Confirmed Icon.png`;
  const ICON_TRUCK = `${ICON_BASE}/Order In Transit Icon.png`;
  const ICON_DELIVERED = `${ICON_BASE}/Order Delivered Icon.png`; // if you don't have this, replace with another icon

  // build dots html
  const dots = (count, activeCount) =>
    Array.from({ length: count })
      .map((_, i) => `<span class="dot ${i < activeCount ? "on" : ""}"></span>`)
      .join("");

  // convert statuses to stage:
  // 0 = confirmed, 1 = delivering/in transit, 2 = delivered/completed
  const computeStage = (orderStatusRaw, logisticsStatusRaw) => {
    const orderStatus = (orderStatusRaw || "").toLowerCase();
    const logisticsStatus = (logisticsStatusRaw || "").toLowerCase();

    let stage = 0;

    // in transit keywords
    if (
      orderStatus.includes("deliver") ||
      orderStatus.includes("transit") ||
      logisticsStatus.includes("transit") ||
      logisticsStatus.includes("out for")
    ) {
      stage = 1;
    }

    // delivered keywords
    if (
      logisticsStatus.includes("deliver") ||
      logisticsStatus.includes("received") ||
      logisticsStatus.includes("complete") ||
      orderStatus.includes("complete") ||
      orderStatus.includes("delivered")
    ) {
      stage = 2;
    }

    return stage;
  };

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

      ordersList.innerHTML = orders
        .map((order, index) => {
          const sellerName = order.ngo_name || "NGO";

          // (Oranges - 1kg, etc) style line
          const itemsText = `(${order.crop_name} - ${order.quantity})`;

          // message text (tries logistics fields, then fallback)
          const msgText =
            logisticsStatuses[index]?.notes ||
            logisticsStatuses[index]?.delivery_message ||
            logisticsStatuses[index]?.message ||
            "Good afternoon order is confirmed! We’re packing your orders now!";

          // stage for progress tracker
          const stage = computeStage(
            order.order_status,
            logisticsStatuses[index]?.delivery_status
          );

          // dots: screenshot look (6 dots each side)
          const leftDotsOn = stage >= 1 ? 6 : 0;
          const rightDotsOn = stage >= 2 ? 6 : 0;

          // optional: keep your old localStorage method field (not shown in screenshot)
          let deliveryMethod = "Not selected";
          try {
            const stored = localStorage.getItem(`farmlink_delivery_${order.order_id}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.method) deliveryMethod = parsed.method;
            }
          } catch {}

          // If you DON'T have Order Delivered Icon.png, fallback automatically:
          const deliveredIconSafe = ICON_DELIVERED || ICON_CONFIRMED;

          return `
            <div class="delivery-card">
              <div class="delivery-top">
                <div class="seller">
                  <img
                    src="/client/public/images/My Account/Defaut Profile Picture.png"
                    class="seller-avatar"
                    alt="Seller"
                  />
                  <div class="seller-text">
                    <div class="seller-name">${sellerName}</div>
                    <div class="seller-items">${itemsText}</div>
                  </div>
                </div>

                <div class="tracker" aria-label="Delivery progress">
                  <img
                    class="track-icon ${stage >= 0 ? "active" : ""}"
                    src="${ICON_CONFIRMED}"
                    alt="Confirmed"
                  />

                  <div class="track-dots">
                    ${dots(6, leftDotsOn)}
                  </div>

                  <img
                    class="track-icon ${stage >= 1 ? "active" : ""}"
                    src="${ICON_TRUCK}"
                    alt="In Transit"
                  />

                  <div class="track-dots">
                    ${dots(6, rightDotsOn)}
                  </div>

                  <img
                    class="track-icon ${stage >= 2 ? "active" : ""}"
                    src="${deliveredIconSafe}"
                    alt="Delivered"
                  />
                </div>
              </div>

              <div class="delivery-message">
                <div class="msg-head">
                  <img
                    src="/client/public/images/My Account/Defaut Profile Picture.png"
                    class="msg-avatar"
                    alt="Seller"
                  />
                  <div class="msg-title">${sellerName}</div>
                </div>

                <div class="msg-text">${msgText}</div>

                <!-- keep these hidden/debug if you want; remove if not needed -->
                <!--
                <div class="msg-text">
                  Status: ${order.order_status} | Payment: ${paymentStatuses[index]}
                  <br/>
                  Delivery: ${logisticsStatuses[index]?.delivery_status || "Pending"}
                  <br/>
                  Method: ${deliveryMethod}
                </div>
                -->
              </div>
            </div>
          `;
        })
        .join("");
    } catch (err) {
      console.error("Failed to load orders:", err);
      ordersList.innerHTML = "<p>Failed to load orders.</p>";
    }
  }

  await loadOrders();
  mirrorBadgesToSidebar(); // keep sidebar badges synced
});
