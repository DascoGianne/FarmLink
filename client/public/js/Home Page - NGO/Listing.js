import API_BASE_URL from "../api/config.js";
import { getMe } from "../api/me.js";
import { clearToken } from "../api/token.js";
import { createListing, deleteListing, getListingsByNgo, updateListing } from "../api/ngoListings.js";
import { uploadListingImage } from "../api/uploads.js";

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

const addModal = document.getElementById("addListingModal");
const openModalBtn = document.querySelector(".top-add-listing-btn");
const cancelBtn = document.getElementById("cancelListingBtn");
const saveBtn = document.getElementById("saveListingBtn");
const listingsRows = document.getElementById("ngoListingsRows");
const imageInputs = Array.from(document.querySelectorAll('.upload-box input[type="file"]'));
const imageBoxes = imageInputs.map((input) => input.closest(".upload-box"));
const currentImageUrls = imageInputs.map(() => "");
const previewObjectUrls = imageInputs.map(() => "");
const pendingFiles = imageInputs.map(() => null);

const cropNameInput = document.getElementById("cropNameInput");
const categoryInput = document.getElementById("categoryInput");
const priceInput = document.getElementById("priceInput");
const totalStocksInput = document.getElementById("totalStocksInput");
const descriptionInput = document.getElementById("descriptionInput");
const statusInput = document.getElementById("statusInput");

let currentListingId = null;

const API_ORIGIN = (() => {
    try {
        return new URL(API_BASE_URL).origin;
    } catch (err) {
        return "";
    }
})();

function resolveImageUrl(url) {
    if (!url) return "";
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (/^\/?uploads\//.test(url)) {
        if (!API_ORIGIN) return url;
        const normalized = url.startsWith("/") ? url : `/${url}`;
        return `${API_ORIGIN}${normalized}`;
    }
    return url;
}

function revokePreviewObjectUrl(index) {
    const objectUrl = previewObjectUrls[index];
    if (!objectUrl) return;
    URL.revokeObjectURL(objectUrl);
    previewObjectUrls[index] = "";
}

function setImagePreview(index, url) {
    const box = imageBoxes[index];
    if (!box) return;
    const span = box.querySelector("span");
    let preview = box.querySelector("img.listing-preview");
    if (!preview) {
        preview = document.createElement("img");
        preview.className = "listing-preview";
        box.appendChild(preview);
    }
    if (url) {
        preview.src = resolveImageUrl(url);
        preview.style.display = "block";
        if (span) span.style.display = "none";
    } else {
        preview.removeAttribute("src");
        preview.style.display = "none";
        if (span) span.style.display = "block";
    }
}

function resetImagePreviews() {
    imageInputs.forEach((input, index) => {
        input.value = "";
        currentImageUrls[index] = "";
        pendingFiles[index] = null;
        revokePreviewObjectUrl(index);
        setImagePreview(index, "");
    });
}

function loadListingImages(listing) {
    const urls = [
        listing?.image_1 || "",
        listing?.image_2 || "",
        listing?.image_3 || "",
        listing?.image_4 || "",
        listing?.image_5 || "",
        listing?.image_6 || "",
    ];

    urls.forEach((url, index) => {
        currentImageUrls[index] = url;
        pendingFiles[index] = null;
        revokePreviewObjectUrl(index);
        setImagePreview(index, url);
    });
}

function openModal(listing) {
    if (!addModal) return;
    currentListingId = listing?.listing_id || null;
    if (cropNameInput) cropNameInput.value = listing?.crop_name || "";
    if (categoryInput) categoryInput.value = listing?.category || "";
    if (priceInput) priceInput.value = listing?.price || "0.00";
    if (totalStocksInput) totalStocksInput.value = listing?.total_stocks || "";
    if (descriptionInput) descriptionInput.value = listing?.description || "";
    if (statusInput) statusInput.value = listing?.status || "Active";
    resetImagePreviews();
    if (listing) {
        loadListingImages(listing);
    }
    addModal.style.display = "flex";
}

function closeModal() {
    if (!addModal) return;
    addModal.style.display = "none";
    currentListingId = null;
    resetImagePreviews();
}

if (openModalBtn) {
    openModalBtn.addEventListener("click", () => openModal(null));
}

if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
}

if (addModal) {
    addModal.addEventListener("click", (e) => {
        if (e.target.id === "addListingModal") {
            closeModal();
        }
    });
}

// ENABLE IMAGE UPLOAD PREVIEW
imageInputs.forEach((input, index) => {
    input.addEventListener("change", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = input.files?.[0];
        if (!file) return;

        revokePreviewObjectUrl(index);
        const objectUrl = URL.createObjectURL(file);
        previewObjectUrls[index] = objectUrl;
        setImagePreview(index, objectUrl);
        pendingFiles[index] = file;
    });
});

async function uploadPendingImages() {
    for (let index = 0; index < pendingFiles.length; index += 1) {
        const file = pendingFiles[index];
        if (!file) continue;
        const data = await uploadListingImage(file);
        currentImageUrls[index] = data.url || "";
        pendingFiles[index] = null;
        revokePreviewObjectUrl(index);
        setImagePreview(index, currentImageUrls[index]);
    }
}



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


async function loadListings() {
    if (!listingsRows) return;

    try {
        const me = await getMe();
        if (me?.user?.role !== "NGO") {
            clearToken();
            window.location.href = "/client/views/layouts/login.html";
            return;
        }
        const ngoId = me?.user?.id;
        if (!ngoId) return;

        const res = await getListingsByNgo(ngoId);
        const listings = res.data || [];

        if (listings.length === 0) {
            listingsRows.innerHTML = "<div class=\"table-row\"><span>No listings yet.</span></div>";
            return;
        }

        listingsRows.innerHTML = listings.map((item) => {
            const imageUrl = resolveImageUrl(
                item.image_1 ||
                item.image_2 ||
                item.image_3 ||
                item.image_4 ||
                item.image_5 ||
                item.image_6 ||
                "/client/public/images/pictures - resources/orange.png"
            );

            return `
            <div class="table-row" data-listing-id="${item.listing_id}">
                <span>${item.listing_id}</span>
                <span class="crop">
                    <img src="${imageUrl}">
                    ${item.crop_name}
                </span>
                <span>${item.category || "N/A"}</span>
                <span>${item.total_stocks || 0}</span>
                <span>${item.price || "N/A"}</span>
                <span>${item.freshness_score || "N/A"}</span>
                <span>
                    <select class="status-select">
                        <option value="Active" ${item.status === "Active" ? "selected" : ""}>Active</option>
                        <option value="Sold out" ${item.status === "Sold out" ? "selected" : ""}>Sold out</option>
                        <option value="Inactive" ${item.status === "Inactive" ? "selected" : ""}>Inactive</option>
                    </select>
                </span>
                <span class="actions">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </span>
            </div>
        `;
        }).join("");

        listingsRows.querySelectorAll(".edit").forEach((btn) => {
            btn.addEventListener("click", () => {
                const row = btn.closest(".table-row");
                const listingId = row?.dataset?.listingId;
                const listing = listings.find((entry) => String(entry.listing_id) === String(listingId));
                if (listing) openModal(listing);
            });
        });

        listingsRows.querySelectorAll(".delete").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const row = btn.closest(".table-row");
                const listingId = row?.dataset?.listingId;
                if (!listingId) return;
                if (!confirm("Delete this listing?")) return;
                try {
                    await deleteListing(listingId);
                    await loadListings();
                } catch (err) {
                    console.error("Delete listing error:", err);
                    alert(err?.message || "Failed to delete listing.");
                }
            });
        });

        listingsRows.querySelectorAll(".status-select").forEach((select) => {
            select.addEventListener("change", async () => {
                const row = select.closest(".table-row");
                const listingId = row?.dataset?.listingId;
                if (!listingId) return;
                try {
                    await updateListing(listingId, { status: select.value });
                } catch (err) {
                    console.error("Status update error:", err);
                    alert(err?.message || "Failed to update status.");
                }
            });
        });
    } catch (err) {
        console.error("Load listings error:", err);
        if (listingsRows) listingsRows.innerHTML = "<div class=\"table-row\"><span>Failed to load listings.</span></div>";
    }
}

async function handleSaveListing() {
    if (!cropNameInput || !categoryInput || !totalStocksInput) return;

    const payloadBase = {
        crop_name: cropNameInput.value.trim(),
        category: categoryInput.value.trim(),
        total_stocks: Number(totalStocksInput.value || 0),
        description: descriptionInput?.value.trim() || "",
        status: statusInput?.value || "Active",
    };

    if (!payloadBase.crop_name || !payloadBase.category || Number.isNaN(payloadBase.total_stocks)) {
        alert("Crop name, category, and total stocks are required.");
        return;
    }

    if (saveBtn) saveBtn.disabled = true;

    try {
        await uploadPendingImages();

        const normalizedImages = currentImageUrls.map((url) => url || null);
        if (!normalizedImages[0]) {
            const fallbackIndex = normalizedImages.findIndex((url) => url);
            if (fallbackIndex > -1) {
                normalizedImages[0] = normalizedImages[fallbackIndex];
                normalizedImages[fallbackIndex] = null;
            }
        }

        const payload = {
            ...payloadBase,
            image_1: normalizedImages[0],
            image_2: normalizedImages[1],
            image_3: normalizedImages[2],
            image_4: normalizedImages[3],
            image_5: normalizedImages[4],
            image_6: normalizedImages[5],
        };

        if (currentListingId) {
            await updateListing(currentListingId, payload);
        } else {
            await createListing(payload);
        }
        closeModal();
        await loadListings();
    } catch (err) {
        console.error("Save listing error:", err);
        alert(err?.message || "Failed to save listing.");
    } finally {
        if (saveBtn) saveBtn.disabled = false;
    }
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveListing);
}

document.addEventListener("DOMContentLoaded", loadListings);
