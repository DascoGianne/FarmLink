import { registerBuyer } from "./api/auth.js";

//Loading 
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    setTimeout(() => {
        loader.classList.add("done");

        setTimeout(() => {
            loader.style.display = "none";
            content.classList.add("show");
        }, 600);
    }, 5000);
});


//form popup
function goWholesale() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-overlay").style.display = "block";

    setTimeout(() => {
        document.getElementById("popup").style.transform =
            "translate(-50%, -50%) scale(1)";
    }, 10);
}

document.getElementById("close-popup").onclick = closePopup;
document.getElementById("popup-overlay").onclick = closePopup;

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup-overlay").style.display = "none";
}

function goRetail(){
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-overlay").style.display = "block";

    setTimeout(() => {
        document.getElementById("popup").style.transform =
            "translate(-50%, - 50%) scale(1)"
    }, 10);
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup-overlay").style.display = "none";
}


// Delivery method "others"
const otherRadio = document.getElementById("otherRadio");
const otherText = document.getElementById("otherText");

otherRadio.addEventListener("change", () => {
    otherText.disabled = false;
});

document.querySelectorAll("input[name='delivery']").forEach(radio => {
    if (radio !== otherRadio) {
        radio.addEventListener("change", () => {
            otherText.disabled = true;
            otherText.value = "";
        });
    }
});


// Password Validation
const pass1 = document.getElementById("password");
const pass2 = document.getElementById("password2");
const passMsg = document.getElementById("passMessage");
const submitBtn = document.getElementById("submitBtn");
const agreement = document.getElementById("agreement");

function isPasswordValid() {
    const p = pass1.value;

    const hasLetter = /[a-zA-Z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSpecial = /[^a-zA-Z0-9]/.test(p);
    const longEnough = p.length >= 8;

    return hasLetter && hasNumber && hasSpecial && longEnough;
}

pass1.addEventListener("focus", () => {
    passMsg.style.display = "block";
});

pass1.addEventListener("input", () => {
    const valid = isPasswordValid();

    if (valid) {
        passMsg.style.color = "green";
        passMsg.textContent = "Password meets all requirements ✅";
    } else {
        passMsg.style.color = "red";
        passMsg.textContent =
            "Minimum of 8 characters, must include letters, numbers and special characters.";
    }

    updateButtonState();
});

pass1.addEventListener("blur", () => {
    passMsg.style.display = "none";
});


pass2.addEventListener("input", updateButtonState);
agreement.addEventListener("change", updateButtonState);

function updateButtonState() {
    const passwordOk = isPasswordValid();
    const match = pass1.value === pass2.value;

    submitBtn.disabled = !(passwordOk && match && agreement.checked);

    if (pass2.value.length > 0 && !match) {
        pass2.style.border = "1px solid red";
    } else {
        pass2.style.border = "1px solid #bfbfbf";
    }
}


function setupToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    // hide eye at start
    icon.style.opacity = "0";

    // show only when typing
    input.addEventListener("input", () => {
        icon.style.opacity = (input.value.length > 0) ? "1" : "0";
    });

    // show when focused and has text
    input.addEventListener("focus", () => {
        if (input.value.length > 0) icon.style.opacity = "1";
    });

    // hide when focus leaves
    input.addEventListener("blur", () => {
        setTimeout(() => icon.style.opacity = "0", 100);
    });

    // prevent focus loss on click
    icon.addEventListener("mousedown", e => e.preventDefault());

    // toggle type + icon image
    icon.addEventListener("click", () => {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";

        icon.src = isHidden
            ? "/client/public/images/pictures - resources/Hide.png"
            : "/client/public/images/pictures - resources/Eye.png";
    });
}

setupToggle("password", "togglePass1");
setupToggle("password2", "togglePass2");

const buyerForm = document.getElementById("buyerSignupForm");
if (buyerForm) {
    buyerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
            contact_number: document.getElementById("contact").value.trim(),
            region: document.getElementById("region").value.trim(),
            province: document.getElementById("province").value.trim(),
            municipality_city: document.getElementById("municipality").value.trim(),
            barangay: document.getElementById("barangay").value.trim(),
            street_no: document.getElementById("street_no").value.trim(),
        };

        try {
            const result = await registerBuyer(data);
            if (result.success) {
                alert("Registration successful! Please log in.");
                window.location.href = "login.html";
            } else {
                alert(result.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    });
}

window.goWholesale = goWholesale;
window.goRetail = goRetail;
