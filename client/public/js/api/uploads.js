import API_BASE_URL from "./config.js";
import { getToken } from "./token.js";

export async function uploadListingImage(file) {
  const token = getToken();

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API_BASE_URL}/uploads/listing-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
