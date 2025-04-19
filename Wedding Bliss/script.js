//script.js
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Vendor Filtering
const filters = document.querySelectorAll('.vendor-filters button');
const vendors = document.querySelectorAll('.vendor');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const type = filter.getAttribute('data-filter');
        vendors.forEach(vendor => {
            if (type === 'all' || vendor.getAttribute('data-type') === type) {
                vendor.style.display = 'block';
            } else {
                vendor.style.display = 'none';
            }
        });
    });
});
// Section Fade-In on Scroll
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
});

sections.forEach(section => observer.observe(section));
// Lightbox Gallery
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeLightbox = document.querySelector('#lightbox .close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImage.src = item.src;
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});
const background = document.querySelector('.animated-background');
const ITEMS_PER_INTERVAL = 5; // Number of bubbles and bouquets every 10 seconds

function createElement(type) {
    const element = document.createElement('div');
    element.className = type;
    element.style.left = `${Math.random() * 100}%`; // Random horizontal position
    element.style.animationDelay = `${Math.random() * 5}s`;
    element.style.animationDuration = `${8 + Math.random() * 5}s`; // Random duration
    background.appendChild(element);

    setTimeout(() => element.remove(), 15000); // Remove element after animation ends
}

// Generate equal numbers of bubbles and bouquets
function generateItems() {
    for (let i = 0; i < ITEMS_PER_INTERVAL; i++) {
        createElement('bubble'); // Create a bubble
        createElement('bouquet'); // Create a bouquet
    }
}

// Call the function every 10 seconds
setInterval(generateItems, 10000);

// Initial call to start immediately
generateItems();


const getStartedButton = document.getElementById('get-started');
const fireworksContainer = document.getElementById('fireworks-container');

function createFirework(x, y) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    
    // Position the firework randomly around the click point
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;

    // Add the firework to the container
    fireworksContainer.appendChild(firework);

    // Remove the firework after the animation ends
    setTimeout(() => {
        firework.remove();
    }, 3000); // Match animation duration
}

// Trigger fireworks when the "Get Started" button is clicked
getStartedButton.addEventListener('click', (event) => {
    const rect = getStartedButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create multiple fireworks in random positions
    for (let i = 0; i < 50; i++) { // Increase the number of fireworks for a bigger effect
        const randomX = centerX + (Math.random() - 0.5) * 800; // Larger random explosion range
        const randomY = centerY + (Math.random() - 0.5) * 800; // Larger random explosion range
        createFirework(randomX, randomY);
    }
});
