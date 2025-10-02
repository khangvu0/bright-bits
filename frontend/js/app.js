// Header hamburger functionality for mobile view
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const toggleBtn = dropdown.querySelector('.nav_icon');
    const menu = dropdown.querySelector('.dropdown_menu');

    // Toggle menu on hamburger click
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault(); // prevent navigation
        menu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
});
