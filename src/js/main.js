// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Enhanced Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
        header.style.background = 'rgba(255, 255, 255, 0.8)';
    } else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Enhanced Form validation and submission
const form = document.querySelector('form');
if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    const submitButton = form.querySelector('.submit-button');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });
        
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        
        if (input.hasAttribute('required') && !value) {
            formGroup.classList.add('error');
            input.setCustomValidity('Ce champ est requis');
        } else if (input.type === 'email' && value && !isValidEmail(value)) {
            formGroup.classList.add('error');
            input.setCustomValidity('Veuillez entrer une adresse email valide');
        } else {
            formGroup.classList.remove('error');
            input.setCustomValidity('');
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all inputs
        let isValid = true;
        inputs.forEach(input => {
            validateInput(input);
            if (input.validity.customError) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        const formData = new FormData(form);
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Message envoyé avec succès!', 'success');
                form.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer le message';
        }
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Enhanced Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with fade-in animation
document.querySelectorAll('.service-card, .package-card, .contact-info, .contact-form').forEach(element => {
    element.classList.add('fade-in-element');
    observer.observe(element);
}); 