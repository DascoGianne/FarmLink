import { getMe } from "../api/me.js";
import { getOrdersByBuyer } from "../api/orders.js";
import { getPaymentByOrder } from "../api/payments.js";
import { getLogisticsByOrder } from "../api/logistics.js";
import { updateBadges } from "../api/badges.js";
import { hydrateBuyerSidebar } from "../api/sidebar.js";

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
  const ICON_BASE = "../../images/My Deliveries (Hard coded lang)";
  const iconUrl = (path) => new URL(path, import.meta.url).toString();
  const ICON_CONFIRMED = iconUrl(`${ICON_BASE}/Order Confirmed Icon.png`);
  const ICON_TRUCK = iconUrl(`${ICON_BASE}/Order In Transit Icon.png`);
  const ICON_DELIVERED = iconUrl(`${ICON_BASE}/Order Ready for PickUp or Delivered.png`);
  const FALLBACK_ICONS = {
    confirmed: "data:image/svg+xml;utf8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#2ea21f"/><path d="M20 33l8 8 16-18" fill="none" stroke="#0b3d0b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ),
    transit: "data:image/svg+xml;utf8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="6" y="22" width="34" height="18" rx="2" fill="#8b8b8b"/><rect x="40" y="28" width="16" height="12" rx="2" fill="#8b8b8b"/><circle cx="20" cy="46" r="6" fill="#6d6d6d"/><circle cx="46" cy="46" r="6" fill="#6d6d6d"/></svg>'
    ),
    delivered: "data:image/svg+xml;utf8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="10" y="24" width="44" height="26" rx="2" fill="#8b8b8b"/><path d="M10 24l22-12 22 12" fill="#9b9b9b"/><path d="M26 38l6 6 12-12" fill="none" stroke="#2ea21f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ),
  };

  // convert statuses to stage:
  // -1 = pending, 0 = confirmed/approved, 1 = delivering/in transit, 2 = delivered/completed
  const computeStage = (orderStatusRaw, logisticsStatusRaw) => {
    const orderStatus = (orderStatusRaw || "").toLowerCase();
    const logisticsStatus = (logisticsStatusRaw || "").toLowerCase();

    let stage = -1;

    if (
      orderStatus.includes("confirm") ||
      orderStatus.includes("approve") ||
      orderStatus.includes("approved")
    ) {
      stage = 0;
    }

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

          const progressStrip =
            stage >= 2 ? ICON_DELIVERED : stage >= 1 ? ICON_TRUCK : ICON_CONFIRMED;

          // optional: keep your old localStorage method field (not shown in screenshot)
          let deliveryMethod = "Not selected";
          try {
            const stored = localStorage.getItem(`farmlink_delivery_${order.order_id}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.method) deliveryMethod = parsed.method;
            }
          } catch {}

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
                    class="track-strip"
                    src="${progressStrip}"
                    alt="Delivery progress"
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

      ordersList.querySelectorAll(".track-icon").forEach((img) => {
        img.addEventListener(
          "error",
          () => {
            const key = img.dataset.icon || "confirmed";
            img.src = FALLBACK_ICONS[key] || FALLBACK_ICONS.confirmed;
          },
          { once: true }
        );
      });
    } catch (err) {
      console.error("Failed to load orders:", err);
      ordersList.innerHTML = "<p>Failed to load orders.</p>";
    }
  }

  await hydrateBuyerSidebar();
  await loadOrders();
  mirrorBadgesToSidebar(); // keep sidebar badges synced
});
