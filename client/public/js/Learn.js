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

/*fixes the scroll bug*/
/* fixes scrollbar click glitch by clamping to the real max scroll */
(function () {
  const container = document.querySelector(".tc-box");
  if (!container) return;

  function clampScroll() {
    const max = container.scrollHeight - container.clientHeight;
    if (container.scrollTop > max) container.scrollTop = max;
    if (container.scrollTop < 0) container.scrollTop = 0;
  }

  // Clamp after any kind of scroll (wheel, drag thumb, click track, keyboard, etc.)
  container.addEventListener("scroll", clampScroll);

  // Clamp after layout changes
  window.addEventListener("resize", clampScroll);
  window.addEventListener("load", clampScroll);

  // Clamp after images load (because images change scrollHeight)
  container.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", clampScroll);
  });

  clampScroll();
})();


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
