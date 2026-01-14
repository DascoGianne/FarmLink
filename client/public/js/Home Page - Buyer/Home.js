import { getListings } from "../api/listings.js";
import { updateBadges } from "../api/badges.js";
import { hydrateBuyerSidebar } from "../api/sidebar.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ================= SIDEBAR (always open) =================
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("open");

  // Sidebar menu search (ONLY sidebar input)
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

  await hydrateBuyerSidebar();

  // ================= BADGES (top icons) =================
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

  // ================= LISTINGS (if you still need it) =================
  // NOTE: Your current Home.html you pasted does NOT have #listingsContainer.
  // This code will safely do nothing if it's missing.
  try {
    const res = await getListings();
    const container = document.getElementById("listingsContainer");

    if (container) {
      container.innerHTML = "";

      (res.data || []).forEach((item) => {
        const div = document.createElement("div");
        div.className = "listing-card";
        div.innerHTML = `
          <h3>${item.crop_name}</h3>
          <p>${item.description || ""}</p>
          <small>Stocks: ${item.total_stocks}</small>
        `;
        container.appendChild(div);
      });
    } else {
      // Not an error—Home page layout may not show listings.
      console.warn("ℹ️ #listingsContainer not found (Home page may not render listings).");
    }
  } catch (err) {
    console.error("Failed to load listings:", err);
    // Don't alert on Home page unless you really want it:
    // alert("Failed to load listings");
  }

  // ================= LOADER (safe) =================
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (content) content.classList.add("show");
  }, 1500);
});
