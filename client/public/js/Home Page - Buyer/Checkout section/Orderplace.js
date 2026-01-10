import { updateBadges } from "../api/badges.js";

/* =========================
   Helpers
========================= */
function setBadge(el, value) {
  if (!el) return;

  const num = Number(value ?? 0);

  // hide if 0 (optional UI behavior)
  if (!Number.isFinite(num) || num <= 0) {
    el.textContent = "0";
    el.style.display = "none";
    return;
  }

  el.textContent = String(num);
  el.style.display = "flex";
}

function getBadgeNumber(el) {
  if (!el) return 0;
  const num = Number(el.textContent);
  return Number.isFinite(num) ? num : 0;
}

/* =========================
   Main
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  /* ===== Sidebar open + search filter ===== */
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.add("open");

  const searchInput = document.querySelector(".search-input");
  const menuItems = document.querySelectorAll("#sidebar-menu li");

  if (searchInput && menuItems.length) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();

      menuItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? "block" : "none";
      });
    });
  }

  /* ===== Badges ===== */
  try {
    // This should talk to backend through badges.js
    await updateBadges();

    const basketTop = document.getElementById("basketBadge");
    const delTop = document.getElementById("deliveriesBadge");

    const basketSide = document.getElementById("sidebarBasketBadge");
    const delSide = document.getElementById("sidebarDeliveriesBadge");

    // Mirror top -> sidebar (works even if updateBadges only updates DOM)
    setBadge(basketSide, getBadgeNumber(basketTop));
    setBadge(delSide, getBadgeNumber(delTop));
  } catch (e) {
    console.error("updateBadges failed:", e);
  }

  /* ===== Cancel modal ===== */
  const modal = document.getElementById("cancelModal");
  const openBtn = document.getElementById("openCancel");
  const closeBtn = document.getElementById("closeCancel");
  const submitBtn = document.getElementById("submitCancel");
  const textarea = document.getElementById("cancelReason");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    textarea?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    if (textarea) textarea.value = ""; // clear after close
  };

  openBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("show")) closeModal();
  });

  submitBtn?.addEventListener("click", () => {
    const reason = textarea?.value?.trim() || "";

    // Basic validation (so user doesn't submit blank)
    if (!reason) {
      alert("Please type your concern before submitting.");
      textarea?.focus();
      return;
    }

    // If you later create an API endpoint, call it here:
    // await cancelOrder(orderId, reason);

    closeModal();
  });
});
