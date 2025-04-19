// JavaScript to handle form submission and result display

// DOM elements
const homeContainer = document.getElementById('home');
const resultContainer = document.getElementById('result');
const form = document.getElementById('fraud-detection-form');
const resultContent = document.getElementById('result-content');

// Form submit event listener
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Simulate result
    const result = Math.random() < 0.5 ? 'Fraud detected!' : 'No fraud detected!';

    // Display result
    resultContent.textContent = result;

    // Hide home page and show result page
    homeContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
});


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
