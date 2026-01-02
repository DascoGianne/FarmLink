import { getAuthJson, postAuthJson } from "./http.js";

export function createPayment(data) {
  return postAuthJson("/payments", data);
}

export function getPaymentByOrder(orderId) {
  return getAuthJson(`/payments/order/${orderId}`);
}
