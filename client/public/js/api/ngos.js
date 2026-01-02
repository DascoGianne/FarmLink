import { getAuthJson, putAuthJson } from "./http.js";

export function getNgoById(ngoId) {
  return getAuthJson(`/ngos/${ngoId}`);
}

export function updateNgoById(ngoId, data) {
  return putAuthJson(`/ngos/${ngoId}`, data);
}
