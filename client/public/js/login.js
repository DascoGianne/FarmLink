import { loginUser } from "./api/auth.js";
import { setToken } from "./api/token.js";

// Loader + UI
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  setTimeout(() => {
    loader.classList.add("done");
    setTimeout(() => {
      loader.style.display = "none";
      content.classList.add("show");
    }, 600);
  }, 2000);

  // Toggle Password Visibility
  function setupToggle(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    icon.style.opacity = "0";

    input.addEventListener("input", () => {
      icon.style.opacity =
        input.value.length > 0 && document.activeElement === input ? "1" : "0";
    });

    input.addEventListener("focus", () => {
      if (input.value.length > 0) icon.style.opacity = "1";
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        icon.style.opacity = "0";
      }, 100);
    });

    icon.addEventListener("mousedown", (e) => e.preventDefault());

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

  // ✅ LOGIN SUBMIT
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const result = await loginUser({ email, password });

      // backend returns: { success, message, data, token }
      if (result.token) {
        setToken(result.token);

        // redirect based on role
        const role = result.data?.role;
        if (role === "BUYER") {
        window.location.href = "./Home page - Buyer/Home.html";
      } else if (role === "NGO") {
         window.location.href = "./Home page - NGO/Home.html";
        } else {
          // fallback
          window.location.href = "dashboard.html";
        }
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.message || "Invalid credentials / server error");
    }
  });
});
