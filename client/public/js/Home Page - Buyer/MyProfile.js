import { getMe } from "../api/me.js";
import { getBuyerById, updateBuyerById } from "../api/buyers.js";

/* =========================
   Loader
========================= */
window.onload = function () {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    setTimeout(() => {
        loader.classList.add("done");

        setTimeout(() => {
            loader.style.display = "none";
            content.classList.add("show");
        }, 600);
    }, 1000);
};

/* =========================
   Sidebar (PERMANENT OPEN)
   - Removed toggle/open/close logic
   - Keep search functionality only
========================= */
document.addEventListener("DOMContentLoaded", () => {
    // Ensure sidebar stays open (safe fallback)
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add("open");

    // Sidebar search functionality
    const searchInput = document.querySelector(".search-input");
    const menuItems = document.querySelectorAll("#sidebar-menu li");

    if (searchInput && menuItems.length) {
        searchInput.addEventListener("input", function () {
            const filter = searchInput.value.toLowerCase();

            menuItems.forEach((item) => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? "block" : "none";
            });
        });
    }
});

/* =========================
   Profile picture upload preview
========================= */
document.addEventListener("DOMContentLoaded", function () {
    const profileUpload = document.getElementById("profile-upload");
    const profileImage = document.querySelector(".profile-image");
    const uploadBtn = document.querySelector(".upload-btn");

    if (profileUpload && profileImage && uploadBtn) {
        profileUpload.addEventListener("change", function () {
            if (this.files && this.files[0]) {
                const file = this.files[0];

                // Validate file size (1 MB = 1048576 bytes)
                if (file.size > 1048576) {
                    alert("File size must be less than 1 MB");
                    this.value = "";
                    return;
                }

                // Validate file type
                const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!validTypes.includes(file.type)) {
                    alert("File must be JPEG or PNG format");
                    this.value = "";
                    return;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileImage.src = e.target.result;

                    // Success indicator
                    uploadBtn.style.background =
                        "linear-gradient(135deg, #4CAF50, #45a049)";
                    uploadBtn.innerHTML = "✓";

                    setTimeout(() => {
                        uploadBtn.innerHTML = "+";
                        uploadBtn.style.background =
                            "linear-gradient(135deg, #32A928, #2a8f22)";
                    }, 2000);
                };
                reader.readAsDataURL(file);
            }
        });

        // Also allow clicking the image to trigger upload
        profileImage.addEventListener("click", function () {
            profileUpload.click();
        });
    }
});

/* =========================
   Password visibility toggle setup
========================= */
function setupPasswordToggles() {
    const passwordFields = [
        { inputId: "current-password", iconId: "toggle-current-pass" },
        { inputId: "new-password", iconId: "toggle-new-pass" },
        { inputId: "confirm-password", iconId: "toggle-confirm-pass" },
    ];

    passwordFields.forEach(({ inputId, iconId }) => {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);

        if (!input || !icon) return;

        // Initially hide the eye icon
        icon.style.opacity = "0";

        // Show/hide icon based on input
        input.addEventListener("input", () => {
            icon.style.opacity =
                input.value.length > 0 && document.activeElement === input ? "0.4" : "0";
        });

        input.addEventListener("focus", () => {
            if (input.value.length > 0) icon.style.opacity = "0.4";
        });

        input.addEventListener("blur", () => {
            setTimeout(() => {
                icon.style.opacity = "0";
            }, 100);
        });

        // Prevent default on mousedown to avoid losing focus
        icon.addEventListener("mousedown", (e) => e.preventDefault());

        // Toggle password visibility
        icon.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text";
                icon.src = "/client/public/images/pictures - resources/Hide.png";
                icon.style.opacity = "0.6";
            } else {
                input.type = "password";
                icon.src = "/client/public/images/pictures - resources/Eye.png";
                icon.style.opacity = "0.6";
            }
        });
    });
}

/* =========================
   Section switching
========================= */
function showSection(sectionId) {
    // Hide all sections
    document
        .querySelectorAll(".edit-Profile-section, .change-password-section")
        .forEach((section) => {
            section.classList.remove("active-section");
            section.style.display = "none";
        });

    // Remove active class from all options
    document.querySelectorAll(".side-option").forEach((option) => {
        option.classList.remove("active");
    });

    // Show selected section and activate option
    const selectedSection = document.getElementById(sectionId + "-section");
    const selectedOption = document.getElementById(sectionId + "-option");

    if (selectedSection && selectedOption) {
        selectedSection.classList.add("active-section");
        selectedSection.style.display = "block";
        selectedOption.classList.add("active");

        if (sectionId === "change-password") {
            setTimeout(() => {
                setupPasswordToggles();
            }, 10);
        }
    }
}

// Make showSection available for inline onclick handlers in HTML
window.showSection = showSection;

// Set initial active state
document.addEventListener("DOMContentLoaded", function () {
    showSection("edit-profile");
});

/* =========================
   Load Buyer Profile
========================= */
async function loadBuyerProfile() {
    const usernameInput = document.getElementById("profile-username");
    const emailInput = document.getElementById("profile-email");
    const contactInput = document.getElementById("profile-contact");
    const addressInput = document.getElementById("profile-address");

    if (!usernameInput || !emailInput || !contactInput || !addressInput) return;

    try {
        const me = await getMe();
        const buyerId = me?.user?.id;

        if (!buyerId) {
            alert("Please log in again.");
            return;
        }

        const res = await getBuyerById(buyerId);
        const buyer = res.data;

        if (!buyer) {
            alert("Buyer profile not found.");
            return;
        }

        usernameInput.value = buyer.username || "";
        emailInput.value = buyer.email || "";
        contactInput.value = buyer.contact_number || "";
        addressInput.value = [
            buyer.street_no,
            buyer.barangay,
            buyer.municipality_city,
            buyer.province,
            buyer.region,
        ]
            .filter(Boolean)
            .join(", ");
    } catch (err) {
        console.error("Failed to load buyer profile:", err);
        alert(err?.message || "Failed to load profile");
    }
}

/* =========================
   Save Buyer Profile
========================= */
async function handleProfileSave() {
    const usernameInput = document.getElementById("profile-username");
    const contactInput = document.getElementById("profile-contact");
    const addressInput = document.getElementById("profile-address");
    const saveBtn = document.getElementById("profile-save-btn");

    if (!usernameInput || !contactInput || !addressInput || !saveBtn) return;

    saveBtn.disabled = true;

    try {
        const me = await getMe();
        const buyerId = me?.user?.id;

        if (!buyerId) {
            alert("Please log in again.");
            return;
        }

        const parts = addressInput.value
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean);

        const [street_no, barangay, municipality_city, province, region] = parts;

        const payload = {
            username: usernameInput.value.trim(),
            contact_number: contactInput.value.trim(),
            street_no: street_no || "",
            barangay: barangay || "",
            municipality_city: municipality_city || "",
            province: province || "",
            region: region || "",
        };

        const res = await updateBuyerById(buyerId, payload);

        if (res.success) {
            alert("Profile updated.");
        } else {
            alert(res.message || "Failed to update profile.");
        }
    } catch (err) {
        console.error("Failed to update buyer profile:", err);
        alert(err?.message || "Failed to update profile");
    } finally {
        saveBtn.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadBuyerProfile();

    const saveBtn = document.getElementById("profile-save-btn");
    if (saveBtn) {
        saveBtn.addEventListener("click", (event) => {
            event.preventDefault();
            handleProfileSave();
        });
    }
});
