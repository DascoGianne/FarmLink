import API_BASE_URL from "./config.js";

/* ---------------- TOKEN HELPERS ---------------- */
export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

/* ---------------- REQUEST HELPERS ---------------- */
async function postJson(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

async function getAuthJson(path) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw result;
  return result;
}

async function postAuthJson(path, data) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();
  let result = null;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { success: false, message: text || "Unexpected response" };
  }
  if (!response.ok) throw result;
  return result;
}

/* ---------------- AUTH API ---------------- */
export function registerNgo(data) {
  return postJson("/auth/register/ngo", data);
}

export function registerBuyer(data) {
  return postJson("/auth/register/buyer", data);
}

export function registerUser(data, role) {
  if (role === "ngo") return registerNgo(data);
  if (role === "buyer") return registerBuyer(data);
  throw new Error("role must be 'ngo' or 'buyer'");
}

export async function loginUser(data) {
  const result = await postJson("/auth/login", data);

  // IMPORTANT: save token after login
  if (result.token) setToken(result.token);

  return result;
}

export function getMe() {
  return getAuthJson("/auth/me");
}

export function changePassword(data) {
  return postAuthJson("/auth/change-password", data);
}
