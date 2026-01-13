import { updateBadges } from "../api/badges.js";
import { hydrateBuyerSidebar } from "../api/sidebar.js";

document.addEventListener("DOMContentLoaded", async () => {
  await hydrateBuyerSidebar();
  updateBadges();
});

const getRoleFromToken = () => {
  const token = localStorage.getItem("farmlink_token") || localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decoded);
    return data?.role || null;
  } catch (err) {
    return null;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const role = getRoleFromToken();
  if (role !== "NGO") return;

  const navRight = document.querySelector(".nav-right");
  if (navRight) {
    navRight.remove();
  }

  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    const links = sidebar.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.includes("MyBasket.html") || href.includes("MyDeliveries.html")) {
        link.remove();
      }
    });
  }
});



// Sidebar
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarBtn = document.querySelector(".sidebar-btn"); // ✅ correct selector
  const closeBtn = document.querySelector(".sidebar-close");

  if (!sidebar || !sidebarBtn || !closeBtn) {
    console.error("Sidebar elements not found:", { sidebar, sidebarBtn, closeBtn });
    return;
  }

  sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // (Optional) close when clicking outside sidebar
  document.addEventListener("click", (e) => {
    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedMenuButton = sidebarBtn.contains(e.target);
    if (!clickedInsideSidebar && !clickedMenuButton) {
      sidebar.classList.remove("open");
    }
  });
});

// Sidebar search functionality
const searchInput = document.querySelector('.search-input');
const menuItems = document.querySelectorAll('#sidebar-menu li');

searchInput.addEventListener('input', function () {
    let filter = searchInput.value.toLowerCase();

    menuItems.forEach(item => {
        let text = item.textContent.toLowerCase();

        if (text.includes(filter)) {
            item.style.display = "block";   
        } else {
            item.style.display = "none"; 
        }
    });
});
