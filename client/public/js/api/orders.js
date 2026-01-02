import { getAuthJson, postAuthJson, putAuthJson } from "./http.js";

export function createOrder(data) {
  return postAuthJson("/orders", data);
}

export function getOrdersByBuyer(buyerId) {
  return getAuthJson(`/orders/buyer/${buyerId}`);
}

export function getOrdersByNgo(ngoId) {
  return getAuthJson(`/orders/ngo/${ngoId}`);
}

export function updateOrderStatus(orderId, order_status) {
  return putAuthJson(`/orders/${orderId}/status`, { order_status });
}
