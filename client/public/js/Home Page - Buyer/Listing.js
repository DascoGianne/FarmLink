import {
  getListingById,
  getPricingByListing,
  getTraceabilityByListing,
} from "../api/listings.js";

const params = new URLSearchParams(window.location.search);
const listingId = params.get("listing_id");

const errorMessage = document.getElementById("errorMessage");
const titleEl = document.getElementById("listingTitle");
const categoryEl = document.getElementById("listingCategory");
const descriptionEl = document.getElementById("listingDescription");
const statusEl = document.getElementById("listingStatus");
const dateEl = document.getElementById("listingDate");
const pricingList = document.getElementById("pricingList");
const traceBox = document.getElementById("traceabilityBox");

function setError(message) {
  if (errorMessage) errorMessage.textContent = message;
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

async function loadListing() {
  if (!listingId) {
    setError("Missing listing_id in the URL.");
    return;
  }

  const results = await Promise.allSettled([
    getListingById(listingId),
    getPricingByListing(listingId),
    getTraceabilityByListing(listingId),
  ]);

  const [listingResult, pricingResult, traceResult] = results;

  if (listingResult.status === "fulfilled") {
    const item = listingResult.value.data;
    if (item) {
      titleEl.textContent = item.crop_name || "Listing";
      categoryEl.textContent = item.category || "";
      descriptionEl.textContent = item.description || "No description available.";
      statusEl.textContent = `Status: ${item.status || "N/A"}`;
      dateEl.textContent = `Date listed: ${formatDate(item.date_listed)}`;
    } else {
      setError("Listing not found.");
    }
  } else {
    setError(listingResult.reason?.message || "Failed to load listing details.");
  }

  if (pricingResult.status === "fulfilled") {
    const pricing = pricingResult.value.data || [];
    pricingList.innerHTML = pricing.length === 0
      ? "<li>No pricing available.</li>"
      : pricing.map((row) => `
          <li>${row.quantity} ${row.unit} - ${row.price}</li>
        `).join("");
  } else {
    pricingList.innerHTML = "<li>Failed to load pricing.</li>";
  }

  if (traceResult.status === "fulfilled") {
    const trace = traceResult.value.data;
    traceBox.innerHTML = trace
      ? `
        <div>Farmer: ${trace.farmer_name}</div>
        <div>Farm: ${trace.farm_address}</div>
        <div>Harvest: ${formatDate(trace.harvest_date)}</div>
        <div>Freshness: ${trace.freshness_score}</div>
      `
      : "<div>No traceability data found.</div>";
  } else {
    traceBox.innerHTML = "<div>Failed to load traceability.</div>";
  }
}

loadListing().catch((err) => {
  console.error("Listing load error:", err);
  setError("Unexpected error while loading listing.");
});
