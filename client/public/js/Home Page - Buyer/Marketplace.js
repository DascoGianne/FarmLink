import { getRescueListings, getListings, getRescueAlertsByListing } from "../api/listings.js";
import { addToCart } from "../api/cart.js";
import { updateBadges } from "../api/badges.js";
import API_BASE_URL from "../api/config.js";

const FALLBACK_LISTING_IMAGE =
  "/client/public/images/pictures - resources/placeholder-produce.png";

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

  // ================= LISTINGS (FETCH ONCE) =================
  const listingsContainer = document.querySelector(".listings");
  const topSearch = document.getElementById("topSearch");

  let allListings = [];

  try {
    const res = await getListings();
    allListings = res.data || [];

    if (listingsContainer) {
      listingsContainer.innerHTML = allListings
        .map((item) => {
          const imageUrl = resolveImageUrl(
            item.image_1 ||
              item.image_2 ||
              item.image_3 ||
              item.image_4 ||
              item.image_5 ||
              item.image_6 ||
              FALLBACK_LISTING_IMAGE
          );

          return `
            <div class="listing-card" data-listing-id="${item.listing_id}">
              <img src="${imageUrl}" alt="${item.crop_name || "Listing image"}">
              <h4>${item.crop_name}</h4>
              <p>${item.category}</p>
              <p>Stocks: ${item.total_stocks}</p>

              <button class="add-to-basket-btn" type="button">Add to Basket</button>
              <button class="rescue-alerts-btn" type="button">View Rescue Alerts</button>

              <div class="rescue-alerts"></div>
            </div>
          `;
        })
        .join("");

      // Card click -> listing page (ignore button clicks)
      listingsContainer.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        const card = event.target.closest(".listing-card");
        const listingId = card?.dataset?.listingId;
        if (!listingId) return;
        window.location.href = `./Listing.html?listing_id=${encodeURIComponent(listingId)}`;
      });

      // Rescue alert buttons
      listingsContainer.querySelectorAll(".rescue-alerts-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const card = btn.closest(".listing-card");
          const listingId = card?.dataset?.listingId;
          const alertsContainer = card?.querySelector(".rescue-alerts");
          if (!listingId || !alertsContainer) return;

          btn.disabled = true;
          btn.textContent = "Loading...";

          try {
            const res = await getRescueAlertsByListing(listingId);
            const alerts = res.data || [];
            alertsContainer.innerHTML =
              alerts.length === 0
                ? "<p>No rescue alerts for this listing.</p>"
                : alerts
                    .map(
                      (alert) => `
                        <div class="rescue-alert-item">
                          <p>Reason: ${alert.reason}</p>
                          <p>Discount: ${alert.discount_applied}%</p>
                          <p>Status: ${alert.rescue_status}</p>
                        </div>
                      `
                    )
                    .join("");
          } catch (err) {
            console.error("Error loading rescue alerts:", err);
            alertsContainer.innerHTML = "<p>Failed to load rescue alerts.</p>";
          } finally {
            btn.disabled = false;
            btn.textContent = "View Rescue Alerts";
          }
        });
      });

      // Add to basket buttons
      listingsContainer.querySelectorAll(".add-to-basket-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const card = btn.closest(".listing-card");
          const listingId = card?.dataset?.listingId;

          const listing = allListings.find(
            (entry) => String(entry.listing_id) === String(listingId)
          );
          if (!listing) return;

          addToCart({
            listing_id: listing.listing_id,
            ngo_id: listing.ngo_id,
            crop_name: listing.crop_name,
            category: listing.category,
            image_1: listing.image_1 || "",
          });

          await updateBadges();
          mirrorBadgesToSidebar();

          btn.textContent = "Added";
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = "Add to Basket";
            btn.disabled = false;
          }, 1000);
        });
      });
    }

    console.log("✅ Listings loaded:", allListings.length);
  } catch (err) {
    console.error("❌ Error loading listings:", err);
  }

  // ================= TOP SEARCH -> FILTER LISTINGS + RESCUE (NOT CATEGORIES) =================
  if (topSearch) {
    const normalize = (v) => String(v || "").toLowerCase().trim();

    const filterListingsInDOM = (query) => {
      const q = normalize(query);
      const cards = document.querySelectorAll(".listings .listing-card");

      cards.forEach((card) => {
        const text = normalize(card.textContent);
        card.style.display = !q || text.includes(q) ? "" : "none";
      });
    };

    const filterRescueInDOM = (query) => {
      const q = normalize(query);
      const cards = document.querySelectorAll(".rescue-deals .rescue-card");

      cards.forEach((card) => {
        const text = normalize(card.textContent);
        card.style.display = !q || text.includes(q) ? "" : "none";
      });
    };

    topSearch.addEventListener("input", () => {
      const q = topSearch.value;
      filterListingsInDOM(q);
      filterRescueInDOM(q);
      // ✅ Categories are NOT affected
    });
  }

  // ================= RESCUE DEALS =================
  const rescueContainer = document.querySelector(".rescue-deals");
  const rescueStatus = document.querySelector(".rescue-status");

  try {
    const res = await getRescueListings();
    const rescue = res.data || [];

    if (rescueContainer) {
      rescueContainer.innerHTML = rescue
        .map(
          (item) => `
            <div class="rescue-card">
              <h4>${item.crop_name}</h4>
              <p>Discount: ${item.discount_applied}%</p>
            </div>
          `
        )
        .join("");
    }

    if (rescueStatus) {
      rescueStatus.innerHTML =
        rescue.length === 0 ? "<p>No rescue deals available.</p>" : "";
    }

    console.log("✅ Rescue deals loaded:", rescue.length);
  } catch (err) {
    console.error("❌ Error loading rescue deals:", err);

    if (rescueStatus) {
      rescueStatus.innerHTML = "<p>Failed to load rescue deals.</p>";
    }
  }
});
