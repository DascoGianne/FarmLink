import { getAuthJson } from "./http.js";

export function getMe() {
  return getAuthJson("/auth/me");
}
