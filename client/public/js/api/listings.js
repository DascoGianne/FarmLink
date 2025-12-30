import API_BASE_URL from "./config.js";

export async function getListings() {
  const response = await fetch(`${API_BASE_URL}/listings`);
  return response.json();
}

export async function createListing(data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
