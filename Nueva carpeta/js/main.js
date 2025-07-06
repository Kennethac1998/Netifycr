// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Testimonial Slider
let currentSlide = 0;

function showSlide(n) {
    // Hide all slides
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Wrap around if needed
    currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
    
    // Show current slide
    testimonialSlides[currentSlide].classList.add('active');
}

// Auto-rotate testimonials
if (testimonialSlides.length > 0) {
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', formObject);
        
        // Show success message
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        this.reset();
    });
}

// Scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate-fadeInUp');
        }
    });
};

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Initial check in case elements are already in view
window.addEventListener('load', animateOnScroll);

// Set contact message for pricing buttons
document.querySelectorAll('.pricing-btn').forEach(button => {
    button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        const message = `¡Hola! Estoy interesado en el plan ${plan}. ¿Me podrían dar más información?`;
        const contactSection = document.getElementById('contact');
        const textarea = contactSection ? contactSection.querySelector('textarea') : null;
        
        if (textarea) {
            textarea.value = message;
            window.scrollTo({
                top: contactSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
