// Close (X) button
const closeBtn = document.querySelector(".close-btn");

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        // Try to close the tab (works if opened via window.open)
        window.close();

        // Fallback if browser blocks it
        if (!window.closed) {
            history.back();
        }
    });
}