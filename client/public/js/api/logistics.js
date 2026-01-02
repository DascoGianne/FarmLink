import { getAuthJson, postAuthJson, putAuthJson } from "./http.js";

export function createLogistics(data) {
  return postAuthJson("/logistics", data);
}

export function getLogisticsByOrder(orderId) {
  return getAuthJson(`/logistics/order/${orderId}`);
}

export function updateLogisticsByOrder(orderId, data) {
  return putAuthJson(`/logistics/order/${orderId}`, data);
}
