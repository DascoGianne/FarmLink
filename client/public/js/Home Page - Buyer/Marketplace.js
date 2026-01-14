import { getRescueListings, getListings, getRescueAlertsByListing } from "../api/listings.js";
import { addToCart } from "../api/cart.js";
import { updateBadges } from "../api/badges.js";
import API_BASE_URL from "../api/config.js";

const FALLBACK_LISTING_IMAGE =
  "/client/public/images/pictures - resources/placeholder-produce.png";

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
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

const norm = (v) => String(v || "").toLowerCase().trim();

const normCategory = (v) => {
  let c = norm(v).replace(/\s+/g, " ");
  if (c.endsWith("s")) c = c.slice(0, -1);
  return c;
};

function extractArray(res) {
  const payload = res?.data ?? res ?? null;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload.data,
    payload.data?.data,
    payload.rows,
    payload.result,
    payload.results,
    payload.items,
    payload.listings,

    payload.alerts,
    payload.rescue_alerts,
    payload.rescueAlerts,
    payload.deals,
    payload.rescueDeals,

    payload.data?.alerts,
    payload.data?.rescue_alerts,
    payload.data?.rescueAlerts,
    payload.data?.deals,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }

  return [];
}

/**
 * ✅ FORCE rescue rows out of any response shape.
 * This fixes cases where backend returns:
 * { data: { rescueListings: {...} } } OR { rescue: {...} } etc.
 */
function extractRescueRows(res) {
  const payload = res?.data ?? res ?? null;
  if (!payload) return [];

  // If it is already an array
  if (Array.isArray(payload)) return payload;

  // If response contains a known array somewhere
  const arr = extractArray(payload);
  if (arr.length) return arr;

  // If response is an object that looks like a single rescue record
  // (has listing_id or listing)
  const looksLikeRescue =
    payload?.listing_id ||
    payload?.listingId ||
    payload?.listing ||
    payload?.data?.listing_id ||
    payload?.data?.listing;

  if (looksLikeRescue) return [payload];

  // Deep scan: find any object that contains listing_id-like keys
  const seen = new Set();
  const walk = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    if (seen.has(obj)) return null;
    seen.add(obj);

    // object looks like rescue item
    if (obj?.listing_id || obj?.listingId || obj?.listing) return obj;

    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (Array.isArray(v) && v.length) return v;
      if (v && typeof v === "object") {
        const found = walk(v);
        if (found) return found;
      }
    }
    return null;
  };

  const found = walk(payload);
  if (!found) return [];
  return Array.isArray(found) ? found : [found];
}

// Simple concurrency limiter
async function mapWithLimit(items, limit, mapper) {
  const results = [];
  let i = 0;

  const workers = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        results[idx] = await mapper(items[idx], idx);
      } catch {
        results[idx] = null;
      }
    }
  });

  await Promise.all(workers);
  return results;
}

document.addEventListener("DOMContentLoaded", async () => {
  // ================= SIDEBAR =================
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("open");

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

  // ================= CONTAINERS =================
  const listingsContainer = document.querySelector(".listings");
  const rescueContainer = document.querySelector(".rescue-deals");
  const rescueStatus = document.querySelector(".rescue-status");
  const topSearch = document.getElementById("topSearch");

  let allListings = [];
  let allRescue = [];

  let activeCategory = null;
  let searchQuery = "";
  let rescueLoaded = false;

  function renderListings(list) {
    if (!listingsContainer) return;

    listingsContainer.innerHTML = list
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
            <h4>${item.crop_name || ""}</h4>
            <p>${item.category || ""}</p>
            <p>Stocks: ${item.total_stocks ?? ""}</p>

            <button class="add-to-basket-btn" type="button">Add to Basket</button>
            <button class="rescue-alerts-btn" type="button">View Rescue Alerts</button>

            <div class="rescue-alerts"></div>
          </div>
        `;
      })
      .join("");
  }

  function renderRescue(list) {
    if (!rescueContainer) return;

    rescueContainer.innerHTML = list
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
          <div class="rescue-card" data-listing-id="${item.listing_id}">
            <img src="${imageUrl}" alt="${item.crop_name || "Rescue item"}">
            <h4>${item.crop_name || ""}</h4>
            <p>Discount: ${Number(item.discount_applied || 0)}%</p>
          </div>
        `;
      })
      .join("");
  }

  function applyFiltersAndRender() {
    const cat = activeCategory ? normCategory(activeCategory) : null;
    const q = norm(searchQuery);

    const filteredListings = allListings.filter((item) => {
      const itemCat = normCategory(item.category);
      const matchesCat = !cat || itemCat === cat;
      const matchesSearch =
        !q || norm(item.crop_name).includes(q) || norm(item.category).includes(q);
      return matchesCat && matchesSearch;
    });

    const filteredRescue = allRescue.filter((item) => {
      const itemCat = normCategory(item.category);
      const matchesCat = !cat || itemCat === cat;
      const matchesSearch =
        !q || norm(item.crop_name).includes(q) || norm(item.category).includes(q);
      return matchesCat && matchesSearch;
    });

    renderListings(filteredListings);
    renderRescue(filteredRescue);

    if (rescueStatus) {
      if (!rescueLoaded) rescueStatus.innerHTML = "<p>Loading rescue deals...</p>";
      else rescueStatus.innerHTML = filteredRescue.length ? "" : "<p>No rescue deals available.</p>";
    }
  }

  // ================= CLICK HANDLERS =================
  if (listingsContainer) {
    listingsContainer.addEventListener("click", async (event) => {
      const card = event.target.closest(".listing-card");
      if (!card) return;

      const listingId = card.dataset.listingId;

      const addBtn = event.target.closest(".add-to-basket-btn");
      if (addBtn) {
        const listing = allListings.find((e) => String(e.listing_id) === String(listingId));
        if (!listing) return;

        addBtn.disabled = true;

        addToCart({
          listing_id: listing.listing_id,
          ngo_id: listing.ngo_id,
          crop_name: listing.crop_name,
          category: listing.category,
          image_1: listing.image_1 || "",
        });

        await updateBadges();
        mirrorBadgesToSidebar();

        addBtn.textContent = "Added";
        setTimeout(() => {
          addBtn.textContent = "Add to Basket";
          addBtn.disabled = false;
        }, 900);
        return;
      }

      const rescueBtn = event.target.closest(".rescue-alerts-btn");
      if (rescueBtn) {
        const alertsContainer = card.querySelector(".rescue-alerts");
        if (!alertsContainer) return;

        rescueBtn.disabled = true;
        rescueBtn.textContent = "Loading...";

        try {
          const res = await getRescueAlertsByListing(listingId);
          console.log("🟨 getRescueAlertsByListing raw:", res);

          let alerts = extractArray(res);
          if (!alerts.length && (res?.data?.alert || res?.alert)) {
            alerts = [res.data?.alert || res.alert];
          }

          alertsContainer.innerHTML =
            alerts.length === 0
              ? "<p>No rescue alerts for this listing.</p>"
              : alerts
                  .map(
                    (alert) => `
                      <div class="rescue-alert-item">
                        <p>Reason: ${alert.reason ?? ""}</p>
                        <p>Discount: ${alert.discount_applied ?? alert.discount ?? 0}%</p>
                        <p>Status: ${alert.rescue_status ?? ""}</p>
                      </div>
                    `
                  )
                  .join("");
        } catch (err) {
          console.error("Error loading rescue alerts:", err);
          alertsContainer.innerHTML = "<p>Failed to load rescue alerts.</p>";
        } finally {
          rescueBtn.disabled = false;
          rescueBtn.textContent = "View Rescue Alerts";
        }
        return;
      }

      if (event.target.closest(".rescue-alerts")) return;

      window.location.href = `./Listing.html?listing_id=${encodeURIComponent(listingId)}`;
    });
  }

  if (rescueContainer) {
    rescueContainer.addEventListener("click", (event) => {
      const card = event.target.closest(".rescue-card");
      const listingId = card?.dataset?.listingId;
      if (!listingId) return;
      window.location.href = `./Listing.html?listing_id=${encodeURIComponent(listingId)}`;
    });
  }

  // ================= CATEGORY =================
  document.querySelectorAll(".cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.getAttribute("aria-label");
      if (!label) return;
      activeCategory = normCategory(activeCategory) === normCategory(label) ? null : label;
      applyFiltersAndRender();
    });
  });

  // ================= SEARCH =================
  if (topSearch) {
    topSearch.addEventListener("input", () => {
      searchQuery = topSearch.value || "";
      applyFiltersAndRender();
    });
  }

  // ================= LOAD LISTINGS =================
  try {
    const listingsRes = await getListings();
    console.log("🟦 getListings raw:", listingsRes);

    allListings = extractArray(listingsRes);
    console.log("✅ Listings loaded:", allListings.length);
  } catch (err) {
    console.error("❌ Error loading listings:", err);
    allListings = [];
  }

  rescueLoaded = false;
  applyFiltersAndRender();

  // ================= LOAD RESCUE DEALS =================
  async function buildRescueDeals() {
    // Try rescue endpoint first
    try {
      const rescueRes = await getRescueListings();
      console.log("🟩 getRescueListings raw:", rescueRes);

      const rows = extractRescueRows(rescueRes);
      console.log("🟩 rescue rows parsed:", rows);

      if (rows.length) {
        // normalize rows into listing-like objects
        const listingById = new Map(allListings.map((l) => [String(l.listing_id), l]));

        allRescue = rows
          .map((row) => {
            const listingId =
              row?.listing_id ?? row?.listingId ?? row?.id ?? row?.listing?.listing_id;

            const base = listingById.get(String(listingId)) || row?.listing || {};

            const discount = Number(
              row?.discount_applied ??
                row?.discount ??
                row?.discount_percentage ??
                row?.discountPercent ??
                base?.discount_applied ??
                0
            );

            return {
              ...base,
              ...row,
              listing_id: listingId ?? base?.listing_id,
              discount_applied: Number.isFinite(discount) ? discount : 0,
            };
          })
          .filter((x) => x?.listing_id);

        return;
      }
    } catch (err) {
      console.warn("⚠️ getRescueListings failed:", err);
    }

    // Fallback: check alerts per listing
    const listingsToCheck = allListings.slice(0, 200);

    const rescueResults = await mapWithLimit(listingsToCheck, 6, async (listing) => {
      const listingId = listing?.listing_id;
      if (!listingId) return null;

      const res = await getRescueAlertsByListing(listingId);
      console.log("🟨 alerts for listing", listingId, res);

      let alerts = extractArray(res);
      if (!alerts.length && (res?.data?.alert || res?.alert)) {
        alerts = [res.data?.alert || res.alert];
      }

      if (!alerts.length) return null;

      // ✅ DO NOT FILTER BY STATUS (to make sure it shows)
      const best = alerts.reduce((max, a) => {
        const d = Number(a?.discount_applied ?? a?.discount ?? 0);
        return d > max ? d : max;
      }, 0);

      return { ...listing, discount_applied: best };
    });

    allRescue = rescueResults.filter(Boolean);
  }

  await buildRescueDeals();
  rescueLoaded = true;

  console.log("✅ allRescue FINAL:", allRescue);
  applyFiltersAndRender();
});
  