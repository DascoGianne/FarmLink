//loader
window.onload = function() {
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


// PRODUCT PRICE DATA
const products = {
    kamote: {
        price: 40,
        quantity: 1
    },
    oranges: {
        price: 100,
        quantity: 1
    }
};

function updateTotal() {
    const total =
        (products.kamote.price * products.kamote.quantity) +
        (products.oranges.price * products.oranges.quantity);

    document.getElementById("totalAmount").textContent = total.toFixed(2);
}

document.querySelectorAll(".qty-controls").forEach(box => {
    const id = box.dataset.id;
    const qtySpan = box.querySelector(".qty");
    const minusBtn = box.querySelector(".minus-btn");
    const addBtn = box.querySelector(".add-btn");

    minusBtn.addEventListener("click", () => {
        if (products[id].quantity > 1) {
            products[id].quantity--;
            qtySpan.textContent = products[id].quantity;
            updateTotal();
        }
    });

    addBtn.addEventListener("click", () => {
        products[id].quantity++;
        qtySpan.textContent = products[id].quantity;
        updateTotal();
    });
});

updateTotal();
