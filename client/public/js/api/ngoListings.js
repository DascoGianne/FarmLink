import { getAuthJson, postAuthJson, putAuthJson, deleteAuthJson } from "./http.js";

export function getListingsByNgo(ngoId) {
  return getAuthJson(`/listings/ngo/${ngoId}`);
}

export function createListing(data) {
  return postAuthJson("/listings", data);
}

export function updateListing(listingId, data) {
  return putAuthJson(`/listings/${listingId}`, data);
}

export function deleteListing(listingId) {
  return deleteAuthJson(`/listings/${listingId}`);
}
