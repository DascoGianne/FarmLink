import { getRescueListings, getListings, getRescueAlertsByListing } from "../api/listings.js";
import { addToCart } from "../api/cart.js";
import { updateBadges } from "../api/badges.js";

document.addEventListener("DOMContentLoaded", async () => {
  await updateBadges();
  // ================= LOADER (GUARANTEED HIDE) =================
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (content) content.classList.add("show");
  }, 800);

  // ================= SIDEBAR =================
  const sidebar = document.getElementById("sidebar");
  const sidebarBtn = document.getElementById("sidebarBtn");
  const closeBtn = document.querySelector(".sidebar-close");

  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  // ================= LISTINGS =================
  const listingsContainer = document.querySelector(".listings");

  try {
    const res = await getListings();
    const listings = res.data || [];

    if (listingsContainer) {
      listingsContainer.innerHTML = listings.map(item => `
        <div class="listing-card" data-listing-id="${item.listing_id}">
          <h4>${item.crop_name}</h4>
          <p>${item.category}</p>
          <p>Stocks: ${item.total_stocks}</p>
          <button class="add-to-basket-btn" type="button">Add to Basket</button>
          <button class="rescue-alerts-btn" type="button">View Rescue Alerts</button>
          <div class="rescue-alerts"></div>
        </div>
      `).join("");

      listingsContainer.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;

        const card = event.target.closest(".listing-card");
        const listingId = card?.dataset?.listingId;

        if (!listingId) return;

        window.location.href = `./Listing.html?listing_id=${encodeURIComponent(listingId)}`;
      });

      const alertButtons = listingsContainer.querySelectorAll(".rescue-alerts-btn");
      alertButtons.forEach((btn) => {
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

            alertsContainer.innerHTML = alerts.length === 0
              ? "<p>No rescue alerts for this listing.</p>"
              : alerts.map((alert) => `
                  <div class="rescue-alert-item">
                    <p>Reason: ${alert.reason}</p>
                    <p>Discount: ${alert.discount_applied}%</p>
                    <p>Status: ${alert.rescue_status}</p>
                  </div>
                `).join("");
          } catch (err) {
            console.error("Error loading rescue alerts:", err);
            alertsContainer.innerHTML = "<p>Failed to load rescue alerts.</p>";
          } finally {
            btn.disabled = false;
            btn.textContent = "View Rescue Alerts";
          }
        });
      });

      const basketButtons = listingsContainer.querySelectorAll(".add-to-basket-btn");
      basketButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".listing-card");
          const listingId = card?.dataset?.listingId;
          const listing = listings.find((entry) => String(entry.listing_id) === String(listingId));

          if (!listing) return;

          addToCart({
            listing_id: listing.listing_id,
            ngo_id: listing.ngo_id,
            crop_name: listing.crop_name,
            category: listing.category,
            image_1: listing.image_1 || "",
          });

          updateBadges();

          btn.textContent = "Added";
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = "Add to Basket";
            btn.disabled = false;
          }, 1000);
        });
      });

    }

    console.log("✅ Listings loaded:", listings.length);
  } catch (err) {
    console.error("❌ Error loading listings:", err);
  }

  // ================= RESCUE DEALS =================
  const rescueContainer = document.querySelector(".rescue-deals");

  try {
    const res = await getRescueListings();
    const rescue = res.data || [];

    if (rescueContainer) {
      rescueContainer.innerHTML = `
        <h3>Rescue Deals!!!</h3>
        ${rescue.length === 0 ? "<p>No rescue deals available.</p>" :
          rescue.map(item => `
            <div class="rescue-card">
              <h4>${item.crop_name}</h4>
              <p>Discount: ${item.discount_applied}%</p>
            </div>
          `).join("")
        }
      `;
    }

    console.log("✅ Rescue deals loaded:", rescue.length);
  } catch (err) {
    console.error("❌ Error loading rescue deals:", err);
  }
});
