import { updateBadges } from "../api/badges.js";

document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
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
