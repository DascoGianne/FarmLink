import { registerBuyer } from "./api/auth.js";

// ✅ Make sure nothing runs until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // ================= LOADER =================
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  // fallback hide loader kahit may issue
  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (content) content.classList.add("show");
  }, 1500);

  // nicer animation if elements exist
  if (loader && content) {
    setTimeout(() => {
      loader.classList.add("done");
      setTimeout(() => {
        loader.style.display = "none";
        content.classList.add("show");
      }, 600);
    }, 1000);
  }

  // ================= POPUP =================
  function openPopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("popup-overlay");
    if (!popup || !overlay) return;

    popup.style.display = "block";
    overlay.style.display = "block";

    setTimeout(() => {
      popup.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
  }

  function closePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("popup-overlay");
    if (popup) popup.style.display = "none";
    if (overlay) overlay.style.display = "none";
  }

  // expose for onclick="goWholesale()" / onclick="goRetail()"
  window.goWholesale = openPopup;
  window.goRetail = openPopup;

  const closeBtn = document.getElementById("close-popup");
  const overlay = document.getElementById("popup-overlay");
  if (closeBtn) closeBtn.onclick = closePopup;
  if (overlay) overlay.onclick = closePopup;

  // ================= OPTIONAL: Delivery method "others" =================
  // (Only runs if the elements exist — prevents module crash)
  const otherRadio = document.getElementById("otherRadio");
  const otherText = document.getElementById("otherText");

  if (otherRadio && otherText) {
    otherRadio.addEventListener("change", () => {
      otherText.disabled = false;
    });

    document.querySelectorAll("input[name='delivery']").forEach((radio) => {
      if (radio !== otherRadio) {
        radio.addEventListener("change", () => {
          otherText.disabled = true;
          otherText.value = "";
        });
      }
    });
  }

  // ================= PASSWORD VALIDATION =================
  const pass1 = document.getElementById("password");
  const pass2 = document.getElementById("password2");
  const passMsg = document.getElementById("passMessage");
  const submitBtn = document.getElementById("submitBtn");
  const agreement = document.getElementById("agreement");

  function isPasswordValid(p) {
    const hasLetter = /[a-zA-Z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSpecial = /[^a-zA-Z0-9]/.test(p);
    const longEnough = p.length >= 8;
    return hasLetter && hasNumber && hasSpecial && longEnough;
  }

  function updateButtonState() {
    if (!pass1 || !pass2 || !submitBtn || !agreement) return;

    const passwordOk = isPasswordValid(pass1.value);
    const match = pass1.value === pass2.value;

    submitBtn.disabled = !(passwordOk && match && agreement.checked);

    if (pass2.value.length > 0 && !match) {
      pass2.style.border = "1px solid red";
    } else {
      pass2.style.border = "1px solid #bfbfbf";
    }
  }

  if (pass1 && passMsg) {
    pass1.addEventListener("focus", () => (passMsg.style.display = "block"));
    pass1.addEventListener("blur", () => (passMsg.style.display = "none"));
    pass1.addEventListener("input", () => {
      const valid = isPasswordValid(pass1.value);
      passMsg.style.display = "block";
      passMsg.style.color = valid ? "green" : "red";
      passMsg.textContent = valid
        ? "Password meets all requirements ✅"
        : "Minimum of 8 characters, must include letters, numbers and special characters.";
      updateButtonState();
    });
  }

  if (pass2) pass2.addEventListener("input", updateButtonState);
  if (agreement) agreement.addEventListener("change", updateButtonState);

  // ================= TOGGLE PASSWORD VISIBILITY =================
  function setupToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    icon.style.opacity = "0";

    input.addEventListener("input", () => {
      icon.style.opacity = input.value.length > 0 ? "1" : "0";
    });

    input.addEventListener("focus", () => {
      if (input.value.length > 0) icon.style.opacity = "1";
    });

    input.addEventListener("blur", () => {
      setTimeout(() => (icon.style.opacity = "0"), 100);
    });

    icon.addEventListener("mousedown", (e) => e.preventDefault());

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

  // ================= BUYER SIGNUP SUBMIT =================
  const buyerForm = document.getElementById("buyerSignupForm");
  if (buyerForm) {
    buyerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        username: document.getElementById("username")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        password: document.getElementById("password")?.value,
        contact_number: document.getElementById("contact")?.value.trim(),
        region: document.getElementById("region")?.value.trim(),
        province: document.getElementById("province")?.value.trim(),
        municipality_city: document.getElementById("municipality")?.value.trim(),
        barangay: document.getElementById("barangay")?.value.trim(),
        street_no: document.getElementById("street_no")?.value.trim(),
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
        console.error("Buyer signup error:", err);
        alert(err?.message || "Server error");
      }
    });
  }
});
