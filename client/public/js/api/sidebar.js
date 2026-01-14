import { getMe } from "./me.js";
import { getBuyerById } from "./buyers.js";

export async function hydrateBuyerSidebar() {
  const accountName = document.querySelector(".account-name");
  if (!accountName) return;

  try {
    const me = await getMe();
    const buyerId = me?.user?.id;
    if (!buyerId) return;

    const buyerRes = await getBuyerById(buyerId);
    const buyer = buyerRes.data || {};
    if (buyer.username) {
      accountName.textContent = buyer.username;
    }
  } catch (err) {
    console.warn("Sidebar name update failed:", err);
  }
}
