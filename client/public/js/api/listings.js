import API_BASE_URL from "./config.js";

async function fetchJson(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

function getListings() {
  return fetchJson("/listings");
}

function getListingById(id) {
  return fetchJson(`/listings/${id}`);
}

function getPricingByListing(listingId) {
  return fetchJson(`/pricing/listing/${listingId}`);
}

function getTraceabilityByListing(listingId) {
  return fetchJson(`/traceability/listing/${listingId}`);
}

function getRescueAlertsByListing(listingId) {
  return fetchJson(`/rescue-alerts/listing/${listingId}`);
}

function getRescueListings() {
  return fetchJson("/listings/rescue");
}

export {
  getListings,
  getListingById,
  getPricingByListing,
  getTraceabilityByListing,
  getRescueAlertsByListing,
  getRescueListings,
};
