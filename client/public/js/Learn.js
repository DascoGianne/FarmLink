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
(function() {
  const container = document.querySelector('.tc-box');
  const signUp = document.querySelector('.Sign1');

  if (!container || !signUp) return; // nothing to do

  function getMaxScroll() {
    const signBottom = signUp.offsetTop + signUp.offsetHeight;
    const max = Math.max(0, signBottom - container.clientHeight);
    return max;
  }

  function clampScroll() {
    const max = getMaxScroll();
    if (container.scrollTop > max) {
      container.scrollTop = max;
    }
  }

  function onWheel(e) {
    const delta = e.deltaY;
    const max = getMaxScroll();

    if (delta > 0 && container.scrollTop >= max - 1) {
      e.preventDefault();
      e.stopPropagation();
      container.scrollTop = max;
    }
  }

  let touchStartY = null;
  function onTouchStart(e) {
    if (e.touches && e.touches.length) touchStartY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    if (!touchStartY) return;
    const touchY = e.touches[0].clientY;
    const delta = touchStartY - touchY; 
    const max = getMaxScroll();

    if (delta > 0 && container.scrollTop >= max - 1) {
      e.preventDefault();
      e.stopPropagation();
      container.scrollTop = max;
    }
    touchStartY = touchY;
  }
  container.addEventListener('scroll', clampScroll, { passive: true });

  container.addEventListener('wheel', onWheel, { passive: false });

  container.addEventListener('touchstart', onTouchStart, { passive: true });
  container.addEventListener('touchmove', onTouchMove, { passive: false });

  window.addEventListener('resize', clampScroll);
  window.addEventListener('load', clampScroll);

  const imgs = container.querySelectorAll('img');
  imgs.forEach(img => {
    if (!img.complete) img.addEventListener('load', clampScroll);
  });

  window.__tcBoxClampScroll = clampScroll;

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
