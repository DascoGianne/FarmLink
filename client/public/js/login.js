// Loader
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

// Toggle Password Visibility
function setupToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    icon.style.opacity = "0";

    input.addEventListener("input", () => {
        icon.style.opacity = (input.value.length > 0 && document.activeElement === input) ? "1" : "0";
    });

    input.addEventListener("focus", () => {
        if (input.value.length > 0) icon.style.opacity = "1";
    });

    input.addEventListener("blur", () => {
        setTimeout(() => { icon.style.opacity = "0"; }, 100);
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



import { loginUser } from "./api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const result = await loginUser({ email, password });

      if (result.token) {
        localStorage.setItem("token", result.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});
