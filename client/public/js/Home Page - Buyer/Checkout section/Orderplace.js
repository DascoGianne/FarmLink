console.log("✅ Orderplace.js loaded");

import { hydrateBuyerSidebar } from "../../api/sidebar.js";

// Load updateBadges safely (so modal still works even if badges import fails)
let updateBadgesFn = null;
(async () => {
  try {
    const mod = await import("../api/badges.js");
    updateBadgesFn = mod.updateBadges;
  } catch (e) {
    console.warn("⚠️ badges.js failed to load. Modal will still work.", e);
  }
})();

/* =========================
   Helpers
========================= */
function setBadge(el, value) {
  if (!el) return;

  const num = Number(value ?? 0);
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
  /* ===== Sidebar stays open + search filter ===== */
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

  await hydrateBuyerSidebar();

  /* ===== Badges (won't break modal if backend/import fails) ===== */
  try {
    // give the dynamic import a moment (optional but helps)
    if (typeof updateBadgesFn === "function") {
      await updateBadgesFn();

      const basketTop = document.getElementById("basketBadge");
      const delTop = document.getElementById("deliveriesBadge");

      const basketSide = document.getElementById("sidebarBasketBadge");
      const delSide = document.getElementById("sidebarDeliveriesBadge");

      setBadge(basketSide, getBadgeNumber(basketTop));
      setBadge(delSide, getBadgeNumber(delTop));
    }
  } catch (e) {
    console.error("updateBadges failed:", e);
  }

  /* =========================
     Cancel Modal (POPUP)
  ========================= */
  const modal = document.getElementById("cancelModal");
  const openBtn = document.getElementById("openCancel");
  const closeBtn = document.getElementById("closeCancel");
  const submitBtn = document.getElementById("submitCancel");
  const textarea = document.getElementById("cancelReason");

  // DEBUG: verify elements exist
  console.log("modal?", !!modal, "openBtn?", !!openBtn, "closeBtn?", !!closeBtn);

  if (!modal || !openBtn || !closeBtn || !submitBtn) return;

  const openModal = () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    textarea?.focus();
    console.log("✅ modal opened");
  };

  const closeModal = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    console.log("✅ modal closed");
  };

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  // click outside closes
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const reason = textarea?.value?.trim() || "";
    if (!reason) {
      alert("Please type your concern before submitting.");
      textarea?.focus();
      return;
    }

    // Backend call later if you add endpoint
    closeModal();
  });
});
