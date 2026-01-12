import { getRescueListings, getListings, getRescueAlertsByListing } from "../api/listings.js";
import { addToCart } from "../api/cart.js";
import { updateBadges } from "../api/badges.js";

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
  const resultsContainer = document.querySelector(".results");
  const topSearch = document.getElementById("topSearch");

  let allListings = [];

  // Helper: render results cards
  const renderResults = (items, query) => {
    if (!resultsContainer) return;

    const q = (query || "").trim();
    if (!q) {
      resultsContainer.innerHTML = `<p style="color:#6b6b6b;margin:0 4px;">Type in the search box to see results.</p>`;
      return;
    }

    if (!items.length) {
      resultsContainer.innerHTML = `<p style="color:#6b6b6b;margin:0 4px;">No results found for "<b>${q}</b>".</p>`;
      return;
    }

    resultsContainer.innerHTML = items
      .map(
        (item) => `
          <div class="result-card" data-listing-id="${item.listing_id}">
            <h4>${item.crop_name}</h4>
            <p>${item.category}</p>
            <p>Stocks: ${item.total_stocks}</p>

            <div class="result-actions">
              <button class="btn-add" type="button">Add</button>
              <button class="btn-view" type="button">View</button>
            </div>
          </div>
        `
      )
      .join("");
  };

  // Helper: do filtering
  const filterListings = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return allListings.filter((item) => {
      const crop = String(item.crop_name || "").toLowerCase();
      const cat = String(item.category || "").toLowerCase();
      // add more fields if you want:
      // const seller = String(item.seller_name || "").toLowerCase();
      return crop.includes(q) || cat.includes(q);
    });
  };

  try {
    const res = await getListings();
    allListings = res.data || [];

    // Render your horizontal Listings row (existing behavior)
    if (listingsContainer) {
      listingsContainer.innerHTML = allListings
        .map(
          (item) => `
          <div class="listing-card" data-listing-id="${item.listing_id}">
            <h4>${item.crop_name}</h4>
            <p>${item.category}</p>
            <p>Stocks: ${item.total_stocks}</p>

            <button class="add-to-basket-btn" type="button">Add to Basket</button>
            <button class="rescue-alerts-btn" type="button">View Rescue Alerts</button>

            <div class="rescue-alerts"></div>
          </div>
        `
        )
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

  // ================= TOP SEARCH -> RESULTS =================
  if (topSearch && resultsContainer) {
    // initial message
    renderResults([], "");

    // live search
    topSearch.addEventListener("input", () => {
      const q = topSearch.value;
      const matches = filterListings(q);
      renderResults(matches, q);
    });

    // click behavior for result cards + buttons (event delegation)
    resultsContainer.addEventListener("click", async (event) => {
      const card = event.target.closest(".result-card");
      if (!card) return;

      const listingId = card.dataset.listingId;
      if (!listingId) return;

      const listing = allListings.find((x) => String(x.listing_id) === String(listingId));
      if (!listing) return;

      // View button OR clicking card (not Add button)
      if (event.target.classList.contains("btn-add")) {
        addToCart({
          listing_id: listing.listing_id,
          ngo_id: listing.ngo_id,
          crop_name: listing.crop_name,
          category: listing.category,
          image_1: listing.image_1 || "",
        });

        await updateBadges();
        mirrorBadgesToSidebar();

        event.target.textContent = "Added";
        event.target.disabled = true;
        setTimeout(() => {
          event.target.textContent = "Add";
          event.target.disabled = false;
        }, 900);
        return;
      }

      // View listing page (either View button or card click)
      window.location.href = `./Listing.html?listing_id=${encodeURIComponent(listingId)}`;
    });
  }

// ================= RESCUE DEALS =================
const rescueContainer = document.querySelector(".rescue-deals");
const rescueStatus = document.querySelector(".rescue-status");

try {
  const res = await getRescueListings();
  const rescue = res.data || [];

  // render ONLY cards inside the flex row
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

  // message goes BELOW (not inside the flex row)
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
