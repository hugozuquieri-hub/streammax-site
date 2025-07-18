// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(planType, planName, planPrice) {
    const existingItem = cart.find(item => item.type === planType);
    if (!existingItem) {
        cart.push({
            type: planType,
            name: planName,
            price: planPrice
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showCartNotification(planName);
    }
}

function removeFromCart(planType) {
    cart = cart.filter(item => item.type !== planType);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    // Update cart counter if exists
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = cart.length;
        cartCounter.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

function showCartNotification(planName) {
    // Create notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle"></i>
            ${planName} adicionado ao carrinho!
            <a href="carrinho.html" style="color: white; text-decoration: underline; margin-left: 10px;">Ver carrinho</a>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const plan = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !plan) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Simulate form submission
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
}

// Plan selection buttons
document.querySelectorAll('.plan-card .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const planCard = this.closest('.plan-card');
        const planName = planCard.querySelector('h3').textContent;
        const planPrice = parseInt(planCard.querySelector('.amount').textContent);
        const planType = planName.toLowerCase().replace(' ', '');
        
        // Add to cart
        addToCart(planType, planName, planPrice);
        
        // Scroll to contact form or redirect to cart
        if (window.location.pathname.includes('planos.html')) {
            window.location.href = 'carrinho.html?plan=' + planType;
        } else {
            const contactSection = document.querySelector('#contato');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // Pre-fill the plan selection in contact form
                setTimeout(() => {
                    const planSelect = document.querySelector('.contact-form select');
                    if (planSelect) {
                        const planValue = planType;
                        planSelect.value = planValue;
                    }
                }, 500);
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 123, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .plan-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// WhatsApp integration
function openWhatsApp(planName = '') {
    const phoneNumber = '5511999999999'; // Replace with actual number
    let message = 'Olá! Gostaria de saber mais sobre os serviços de IPTV.';
    
    if (planName) {
        message = `Olá! Tenho interesse no plano ${planName}. Gostaria de mais informações.`;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add WhatsApp click handlers
document.querySelectorAll('.contact-item').forEach(item => {
    if (item.textContent.includes('WhatsApp')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => openWhatsApp());
    }
});

// Floating WhatsApp button
const createFloatingWhatsApp = () => {
    const floatingBtn = document.createElement('div');
    floatingBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #25d366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        z-index: 1000;
        transition: transform 0.3s ease;
    `;
    
    floatingBtn.addEventListener('mouseenter', () => {
        floatingBtn.style.transform = 'scale(1.1)';
    });
    
    floatingBtn.addEventListener('mouseleave', () => {
        floatingBtn.style.transform = 'scale(1)';
    });
    
    floatingBtn.addEventListener('click', () => openWhatsApp());
    
    document.body.appendChild(floatingBtn);
};

// Add cart button to navbar
const addCartButton = () => {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.querySelector('.cart-btn')) {
        const cartBtn = document.createElement('li');
        cartBtn.innerHTML = `
            <a href="carrinho.html" class="nav-link cart-btn" style="position: relative;">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-counter" style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #28a745;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    display: none;
                ">${cart.length}</span>
            </a>
        `;
        navMenu.appendChild(cartBtn);
        updateCartDisplay();
    }
};

// Loading screen (optional)
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('StreamMax website loaded successfully!');
    createFloatingWhatsApp();
    addCartButton();
    updateCartDisplay();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

