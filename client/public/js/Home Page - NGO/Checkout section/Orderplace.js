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

const cancelBtn = document.querySelector(".cancel-btn");
const cancelModal = document.getElementById("cancelModal");
const cancelClose = document.querySelector(".cancel-close");

cancelBtn.addEventListener("click", () => {
    cancelModal.classList.add("show");
});

cancelClose.addEventListener("click", () => {
    cancelModal.classList.remove("show");
});

// close when clicking outside the card
cancelModal.addEventListener("click", (e) => {
    if (e.target === cancelModal) {
        cancelModal.classList.remove("show");
    }
});
