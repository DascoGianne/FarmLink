import { getAuthJson, putAuthJson } from "./http.js";

export function getBuyerById(buyerId) {
  return getAuthJson(`/buyers/${buyerId}`);
}

export function updateBuyerById(buyerId, data) {
  return putAuthJson(`/buyers/${buyerId}`, data);
}
