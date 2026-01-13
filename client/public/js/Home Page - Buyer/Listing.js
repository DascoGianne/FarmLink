import {
  getListingById,
  getPricingByListing,
  getTraceabilityByListing,
} from "../api/listings.js";
import API_BASE_URL from "../api/config.js";

const FALLBACK_LISTING_IMAGE = "/client/public/images/pictures - resources/placeholder-produce.png";

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

const params = new URLSearchParams(window.location.search);
const listingId = params.get("listing_id");

/* ===== UI ELEMENTS ===== */
const errorMessage = document.getElementById("errorMessage");

const titleEl = document.getElementById("listingTitle");
const categoryEl = document.getElementById("listingCategory");
const descriptionEl = document.getElementById("listingDescription");
const statusEl = document.getElementById("listingStatus");
const dateEl = document.getElementById("listingDate");

const freshnessEl = document.getElementById("freshnessScore");
const harvestEl = document.getElementById("harvestDate");

const farmNameEl = document.getElementById("farmName");
const farmerNameEl = document.getElementById("farmerName");
const farmAddressEl = document.getElementById("farmAddress");

const oldPriceEl = document.getElementById("oldPrice");
const newPriceEl = document.getElementById("newPrice");
const stockLeftEl = document.getElementById("stockLeft");

const listingImageEl = document.getElementById("listingImage");
const quantityPillsEl = document.getElementById("quantityPills");

const closeBtn = document.getElementById("closeBtn");

/* ✅ NEW BUTTONS */
const checkoutBtn = document.getElementById("checkoutBtn");
const addToCartBtn = document.getElementById("addToCartBtn");

/* Legacy hidden elements */
const pricingList = document.getElementById("pricingList");
const traceBox = document.getElementById("traceabilityBox");

/* ===== STATE (selected quantity) ===== */
let selectedQty = null;
let selectedUnit = null;
let selectedPrice = null;

function setError(message) {
  if (errorMessage) errorMessage.textContent = message || "";
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "2-digit" }).toUpperCase();
}

function formatDateLong(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
}

function parsePriceNumber(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function setActivePill(btn) {
  if (!quantityPillsEl) return;
  quantityPillsEl.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
}

function setDisplayedPrice(row) {
  const p = parsePriceNumber(row?.price);
  selectedPrice = p;

  if (p == null) {
    if (newPriceEl) newPriceEl.textContent = "—";
    if (oldPriceEl) oldPriceEl.textContent = "";
    return;
  }

  if (newPriceEl) newPriceEl.textContent = p.toFixed(2);

  // Replace this if you have a real regular price field
  const old = p + 100;
  if (oldPriceEl) oldPriceEl.textContent = `₱${old.toFixed(2)}`;
}

function initPricingUI(pricingRows) {
  if (!Array.isArray(pricingRows) || pricingRows.length === 0) {
    if (newPriceEl) newPriceEl.textContent = "—";
    if (oldPriceEl) oldPriceEl.textContent = "";
    return;
  }

  // default is first row
  const defaultRow = pricingRows[0];
  selectedQty = defaultRow.quantity ?? null;
  selectedUnit = defaultRow.unit ?? null;
  setDisplayedPrice(defaultRow);

  if (quantityPillsEl) {
    quantityPillsEl.innerHTML = pricingRows
      .map((row, idx) => {
        const qty = row.quantity ?? "";
        const unit = row.unit ?? "";
        const label = `${qty}${unit}`.trim() || "Option";
        return `
          <button class="pill ${idx === 0 ? "active" : ""}"
            data-idx="${idx}"
            data-qty="${qty}"
            data-unit="${unit}">
            ${label}
          </button>
        `;
      })
      .join("");

    quantityPillsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill");
      if (!btn) return;

      setActivePill(btn);

      const idx = Number(btn.dataset.idx);
      const row = pricingRows[idx];
      if (!row) return;

      selectedQty = row.quantity ?? null;
      selectedUnit = row.unit ?? null;
      setDisplayedPrice(row);
    });
  }
}

async function loadListing() {
  if (!listingId) {
    setError("Missing listing_id in the URL.");
    return;
  }

  /* Close modal */
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      window.location.href = "./Marketplace.html";
    });
  }

  const results = await Promise.allSettled([
    getListingById(listingId),
    getPricingByListing(listingId),
    getTraceabilityByListing(listingId),
  ]);

  const [listingResult, pricingResult, traceResult] = results;

  /* LISTING */
  if (listingResult.status === "fulfilled") {
    const item = listingResult.value?.data;
    if (item) {
      if (titleEl) titleEl.textContent = item.crop_name || "Listing";
      if (categoryEl) categoryEl.textContent = item.category || "";
      if (descriptionEl) descriptionEl.textContent = item.description || "No description available.";
      if (statusEl) statusEl.textContent = `Status: ${item.status || "N/A"}`;
      if (dateEl) dateEl.textContent = `Date listed: ${formatDateLong(item.date_listed)}`;

      if (listingImageEl) {
        const imageUrl = resolveImageUrl(
          item.image_1 ||
            item.image_2 ||
            item.image_3 ||
            item.image_4 ||
            item.image_5 ||
            item.image_6 ||
            FALLBACK_LISTING_IMAGE
        );
        listingImageEl.src = imageUrl;
      }

      if (stockLeftEl && item.stocks_left != null) {
        stockLeftEl.textContent = `${item.stocks_left} kg`;
      }
    } else {
      setError("Listing not found.");
    }
  } else {
    setError(listingResult.reason?.message || "Failed to load listing details.");
  }

  /* PRICING */
  let pricing = [];
  if (pricingResult.status === "fulfilled") {
    pricing = pricingResult.value?.data || [];

    if (pricingList) {
      pricingList.innerHTML =
        pricing.length === 0
          ? "<li>No pricing available.</li>"
          : pricing.map((row) => `<li>${row.quantity} ${row.unit} - ${row.price}</li>`).join("");
    }

    initPricingUI(pricing);
  } else {
    if (pricingList) pricingList.innerHTML = "<li>Failed to load pricing.</li>";
    initPricingUI([]);
  }

  /* TRACEABILITY */
  if (traceResult.status === "fulfilled") {
    const trace = traceResult.value?.data;

    if (trace) {
      if (farmerNameEl) farmerNameEl.textContent = trace.farmer_name ? `Farmer ${trace.farmer_name}` : "—";
      if (farmNameEl) farmNameEl.textContent = trace.farm_name || "—";
      if (farmAddressEl) farmAddressEl.textContent = trace.farm_address || "—";

      if (harvestEl) harvestEl.textContent = formatDate(trace.harvest_date);
      if (freshnessEl) freshnessEl.textContent = trace.freshness_score ?? "—";

      if (stockLeftEl && trace.stocks_left != null) {
        stockLeftEl.textContent = `${trace.stocks_left} kg`;
      }

      if (traceBox) {
        traceBox.innerHTML = `
          <div>Farmer: ${trace.farmer_name ?? "N/A"}</div>
          <div>Farm: ${trace.farm_address ?? "N/A"}</div>
          <div>Harvest: ${formatDateLong(trace.harvest_date)}</div>
          <div>Freshness: ${trace.freshness_score ?? "N/A"}</div>
        `;
      }
    } else {
      if (harvestEl) harvestEl.textContent = "—";
      if (freshnessEl) freshnessEl.textContent = "—";
      if (farmNameEl) farmNameEl.textContent = "—";
      if (farmerNameEl) farmerNameEl.textContent = "—";
      if (farmAddressEl) farmAddressEl.textContent = "—";
      if (traceBox) traceBox.innerHTML = "<div>No traceability data found.</div>";
    }
  } else {
    if (traceBox) traceBox.innerHTML = "<div>Failed to load traceability.</div>";
    if (harvestEl) harvestEl.textContent = "—";
    if (freshnessEl) freshnessEl.textContent = "—";
  }

  /* ✅ BUTTON ACTIONS */
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (!selectedQty || !selectedUnit) {
        alert("Please select a quantity first.");
        return;
      }

      // Replace this with your real cart API call later:
      alert(`Added to cart: ${titleEl?.textContent || "Item"} (${selectedQty}${selectedUnit})`);
    });
  }

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const checkoutUrl = new URL("./Checkout section/Checkout.html", window.location.href).href;
    window.location.href = checkoutUrl;
  });
}

}

loadListing().catch((err) => {
  console.error("Listing load error:", err);
  setError("Unexpected error while loading listing.");
});
