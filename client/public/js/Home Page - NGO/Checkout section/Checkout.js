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
const sidebarBtn = document.querySelector('.sidebar-toggle-btn'); // changed
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


//payment
const buttons = document.querySelectorAll('.pay-btn');
const contents = document.querySelectorAll('.payment-content');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active state
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('show'));

        // Activate selected
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('show');
    });
});

document.querySelectorAll('.upload-box input[type="file"]').forEach(input => {
    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            this.value = '';
            return;
        }

        const preview = this.parentElement.querySelector('.receipt-preview');
        const text = this.parentElement.querySelector('span');

        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        text.style.display = 'none';
    });
});


