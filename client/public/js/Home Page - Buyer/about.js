import { updateBadges } from "../api/badges.js";

// Function to get role from token
const getRoleFromToken = () => {
  const token = localStorage.getItem("farmlink_token") || localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decoded);
    return data?.role || null;
  } catch (err) {
    console.warn("Failed to decode token:", err);
    return null;
  }
};

// Run on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  updateBadges();

  const role = getRoleFromToken();
  console.log("User role:", role); // Log the role for debugging

  // Only hide basket/deliveries if the role is NGO
  if (role === "NGO") {
    const navRight = document.querySelector(".nav-right");
    if (navRight) {
      navRight.style.display = "none";
    }

    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      const links = sidebar.querySelectorAll('a[href*="MyBasket.html"], a[href*="MyDeliveries.html"]');
      links.forEach(link => {
        const listItem = link.closest("li");
        if (listItem) {
          listItem.style.display = "none";
        } else {
          link.style.display = "none";
        }
      });
    }
  }

  // Initialize sidebar functionality
  initSidebar();
  initSidebarSearch();
});

// Function to handle sidebar open/close
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarBtn = document.querySelector(".sidebar-btn");
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

  // Optional: close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedMenuButton = sidebarBtn.contains(e.target);
    if (!clickedInsideSidebar && !clickedMenuButton) {
      sidebar.classList.remove("open");
    }
  });
}

// Function to initialize sidebar search
function initSidebarSearch() {
  const searchInput = document.querySelector('.search-input');
  const menuItems = document.querySelectorAll('#sidebar-menu li');

  if (!searchInput) {
    console.warn("Search input not found.");
    return;
  }

  searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    menuItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(filter) ? "flex" : "none";
    });
  });
}
