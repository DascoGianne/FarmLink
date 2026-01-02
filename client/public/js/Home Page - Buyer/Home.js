//loader
window.onload = function() {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    // Optional: wait a bit before starting animation
    setTimeout(() => {
        loader.classList.add("done");

        // Wait for CSS transition to finish
        setTimeout(() => {
            loader.style.display = "none"; 
            content.classList.add("show");
        }, 600); 
    }, 1000); // 1 second delay for demo
};

// Sidebar
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.querySelector('#top .left-group img');
const closeBtn = document.querySelector('.sidebar-close');

sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
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


import { getListings } from "../api/listings.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await getListings();
    console.log("LISTINGS:", res);

    const container = document.getElementById("listingsContainer");
    if (!container) {
      console.warn("Missing #listingsContainer in HTML");
      return;
    }

    container.innerHTML = "";

    res.data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "listing-card";
      div.innerHTML = `
        <h3>${item.crop_name}</h3>
        <p>${item.description || ""}</p>
        <small>Stocks: ${item.total_stocks}</small>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load listings:", err);
    alert("Failed to load listings");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (content) content.classList.add("show");
  }, 1500);
});
