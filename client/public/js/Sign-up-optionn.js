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


function goBuyer() {
    window.location.href = "Sign-up-option.html";
}


//form popup
function goNGO() {
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


    icon.style.opacity = "0";
    input.addEventListener("input", () => {
        if (input.value.length > 0 && document.activeElement === input) {
            icon.style.opacity = "1";
        } else {
            icon.style.opacity = "0";
        }
    });

    input.addEventListener("focus", () => {
        if (input.value.length > 0) {
            icon.style.opacity = "1";
        }
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            icon.style.opacity = "0";
        }, 100);
    });

    icon.addEventListener("mousedown", e => e.preventDefault());

    icon.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            icon.src = "/client/public/images/pictures - resources/Hide.png";
        } else {
            input.type = "password";
            icon.src = "/client/public/images/pictures - resources/Eye.png";
        }
    });
}

setupToggle("password", "togglePass1");
setupToggle("password2", "togglePass2");
