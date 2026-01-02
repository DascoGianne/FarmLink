import { getMe } from "../api/me.js";
import { getNgoById, updateNgoById } from "../api/ngos.js";

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


// Profile picture upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.querySelector('.profile-image');
    const uploadBtn = document.querySelector('.upload-btn');
    
    if (profileUpload && profileImage) {
        profileUpload.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Validate file size (1 MB = 1048576 bytes)
                if (file.size > 1048576) {
                    alert('File size must be less than 1 MB');
                    this.value = '';
                    return;
                }
                
                // Validate file type
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    alert('File must be JPEG or PNG format');
                    this.value = '';
                    return;
                }
                
                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    // Add a success indicator
                    uploadBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    uploadBtn.innerHTML = '✓';
                    setTimeout(() => {
                        uploadBtn.innerHTML = '+';
                        uploadBtn.style.background = 'linear-gradient(135deg, #32A928, #2a8f22)';
                    }, 2000);
                }
                reader.readAsDataURL(file);
            }
        });
        
        // Also allow clicking the image to trigger upload
        profileImage.addEventListener('click', function() {
            profileUpload.click();
        });
    }
});

// Password visibility toggle setup
function setupPasswordToggles() {
    const passwordFields = [
        { inputId: 'current-password', iconId: 'toggle-current-pass' },
        { inputId: 'new-password', iconId: 'toggle-new-pass' },
        { inputId: 'confirm-password', iconId: 'toggle-confirm-pass' }
    ];

    passwordFields.forEach(({ inputId, iconId }) => {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);

        if (!input || !icon) return;

        // Initially hide the eye icon
        icon.style.opacity = "0";

        // Show/hide icon based on input
        input.addEventListener("input", () => {
            icon.style.opacity = (input.value.length > 0 && document.activeElement === input) ? "0.4" : "0";
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
        icon.addEventListener("mousedown", e => e.preventDefault());

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

// Update the showSection function in MyProfile.js
function showSection(sectionId) {
    // Hide all sections
    const sections = [
        'edit-profile-section',
        'delivery-methods-section',
        'payment-methods-section',
        'change-password-section'
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.remove('active-section');
            element.style.display = 'none';
        }
    });
    
    // Remove active class from all options
    document.querySelectorAll('.side-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Show selected section and activate option
    const selectedSection = document.getElementById(sectionId + '-section');
    const selectedOption = document.getElementById(sectionId + '-option');
    
    if (selectedSection && selectedOption) {
        selectedSection.classList.add('active-section');
        selectedSection.style.display = 'block';
        selectedOption.classList.add('active');
        
        // Initialize password toggles when showing change password section
        if (sectionId === 'change-password') {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                setupPasswordToggles();
            }, 10);
        }
    }
}

// Update the initial call to show edit-profile
document.addEventListener('DOMContentLoaded', function() {
    // Set initial active state
    showSection('edit-profile');
});

async function loadNgoProfile() {
    const nameInput = document.getElementById("profile-ngo-name");
    const emailInput = document.getElementById("profile-email");
    const contactInput = document.getElementById("profile-contact");
    const addressInput = document.getElementById("profile-address");

    if (!nameInput || !emailInput || !contactInput || !addressInput) return;

    try {
        const me = await getMe();
        const ngoId = me?.user?.id;

        if (!ngoId) {
            alert("Please log in again.");
            return;
        }

        const res = await getNgoById(ngoId);
        const ngo = res.data;

        if (!ngo) {
            alert("NGO profile not found.");
            return;
        }

        nameInput.value = ngo.ngo_name || "";
        emailInput.value = ngo.email || "";
        contactInput.value = ngo.contact_number || "";
        addressInput.value = [
            ngo.street_no,
            ngo.barangay,
            ngo.municipality_city,
            ngo.province,
            ngo.region,
        ].filter(Boolean).join(", ");
    } catch (err) {
        console.error("Failed to load NGO profile:", err);
        alert(err?.message || "Failed to load profile");
    }
}

async function handleProfileSave() {
    const nameInput = document.getElementById("profile-ngo-name");
    const contactInput = document.getElementById("profile-contact");
    const addressInput = document.getElementById("profile-address");
    const saveBtn = document.getElementById("profile-save-btn");

    if (!nameInput || !contactInput || !addressInput || !saveBtn) return;

    saveBtn.disabled = true;

    try {
        const me = await getMe();
        const ngoId = me?.user?.id;

        if (!ngoId) {
            alert("Please log in again.");
            return;
        }

        const parts = addressInput.value.split(",").map((part) => part.trim()).filter(Boolean);
        const [street_no, barangay, municipality_city, province, region] = parts;

        const payload = {
            ngo_name: nameInput.value.trim(),
            contact_number: contactInput.value.trim(),
            street_no: street_no || "",
            barangay: barangay || "",
            municipality_city: municipality_city || "",
            province: province || "",
            region: region || "",
        };

        const res = await updateNgoById(ngoId, payload);
        if (res.success) {
            alert("Profile updated.");
        } else {
            alert(res.message || "Failed to update profile.");
        }
    } catch (err) {
        console.error("Failed to update NGO profile:", err);
        alert(err?.message || "Failed to update profile");
    } finally {
        saveBtn.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadNgoProfile();

    const saveBtn = document.getElementById("profile-save-btn");
    if (saveBtn) {
        saveBtn.addEventListener("click", (event) => {
            event.preventDefault();
            handleProfileSave();
        });
    }
});
