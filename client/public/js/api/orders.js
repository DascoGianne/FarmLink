import API_BASE_URL from "./config.js";

export async function createOrder(data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
