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

// OPEN MODAL
document.querySelector('.top-add-listing-btn').addEventListener('click', () => {
    document.getElementById('addListingModal').style.display = 'flex';
});

// CLOSE MODAL
document.querySelector('.cancel-btn').addEventListener('click', () => {
    document.getElementById('addListingModal').style.display = 'none';
});

// CLICK OUTSIDE TO CLOSE
document.getElementById('addListingModal').addEventListener('click', (e) => {
    if (e.target.id === 'addListingModal') {
        e.currentTarget.style.display = 'none';
    }
});

// ENABLE IMAGE UPLOAD PREVIEW
document.querySelectorAll('.upload-box input[type="file"]').forEach(input => {
    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;

            const box = this.parentElement;
            box.innerHTML = '';
            box.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});



// OPEN FRESHNESS FORM
document.getElementById('openFreshnessForm').addEventListener('click', () => {
    document.getElementById('freshnessModal').style.display = 'flex';
});

// CLOSE FRESHNESS FORM
document.querySelector('.close-freshness').addEventListener('click', () => {
    document.getElementById('freshnessModal').style.display = 'none';
});

// CLICK OUTSIDE CLOSE
document.getElementById('freshnessModal').addEventListener('click', e => {
    if (e.target.id === 'freshnessModal') {
        e.currentTarget.style.display = 'none';
    }
});


document.addEventListener('DOMContentLoaded', () => {

    const quantityPanel = document.getElementById('quantityPanel');
    const promoPanel = document.getElementById('promoPanel');

    const editQuantityBtn = document.getElementById('editQuantity');
    const openPromoBtn = document.getElementById('openPromo');

    const qtyInput = document.getElementById('qtyInput');
    const unitInput = document.getElementById('unitInput');
    const priceInput = document.getElementById('priceInput');

    const quantityDisplay = document.getElementById('quantityDisplay');
    const mainPrice = document.getElementById('mainPrice');

    if (!quantityPanel || !promoPanel) return;

    // OPEN QUANTITY PANEL
    editQuantityBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        quantityPanel.style.display = 'block';
        promoPanel.style.display = 'none';
    });

    // OPEN PROMO PANEL
    openPromoBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        promoPanel.style.display = 'block';
        quantityPanel.style.display = 'none';
    });

    // CLOSE BUTTONS
    document.querySelectorAll('.close-panel').forEach(btn => {
        btn.addEventListener('click', () => {
            quantityPanel.style.display = 'none';
            promoPanel.style.display = 'none';
        });
    });

    // UPDATE QUANTITY DISPLAY
    function updateQuantity() {
        quantityDisplay.value = `${qtyInput.value}${unitInput.value}`;
    }

    qtyInput?.addEventListener('input', updateQuantity);
    unitInput?.addEventListener('change', updateQuantity);

    // SYNC PRICE
    priceInput?.addEventListener('input', () => {
        mainPrice.value = priceInput.value;
    });

    // CLICK OUTSIDE CLOSE
    document.addEventListener('click', e => {
        if (
            !quantityPanel.contains(e.target) &&
            !promoPanel.contains(e.target) &&
            !editQuantityBtn.contains(e.target) &&
            !openPromoBtn.contains(e.target)
        ) {
            quantityPanel.style.display = 'none';
            promoPanel.style.display = 'none';
        }
    });

});


import { getListings } from "./api/listings.js";

async function loadListings() {
  const listings = await getListings();
  console.log(listings);

  // example: show listings in HTML
  const container = document.getElementById("listingsContainer");

  listings.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item.crop_name; // adjust based on DB columns
    container.appendChild(div);
  });
}

loadListings();
