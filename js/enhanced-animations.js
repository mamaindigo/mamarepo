/**
 * INDIGO Fund - Enhanced Animations
 * Based on Pantera Capital website animation patterns
 */

document.addEventListener('DOMContentLoaded', function() {
  // Store last scroll position for header show/hide
  let lastScrollPosition = 0;
  
  // Header scroll behavior
  function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    
    // Add/remove colored class based on scroll position
    if (currentScroll > 3) {
      document.querySelector("header").classList.add("closed");
      document.querySelector('header').classList.add('colored');
    } else {
      document.querySelector("header").classList.remove("closed");
      document.querySelector('header').classList.remove('colored');
    }
    
    // Show/hide header based on scroll direction
    if (lastScrollPosition > currentScroll) {
      document.querySelector('header').classList.add('visible');
    } else {
      document.querySelector('header').classList.remove('visible');
    }
    
    lastScrollPosition = currentScroll;
  }
  
  // Animate elements on scroll
  function animateOnScroll() {
    const animElements = document.querySelectorAll('.anim');
    
    animElements.forEach((element, index) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.8) {
        // Add delay based on index for staggered animation
        setTimeout(() => {
          element.classList.remove('anim');
          element.classList.add('animated');
        }, index * 100);
      }
    });
  }
  
  // Stats section parallax effect
  function handleStatsParallax() {
    const statsSection = document.querySelector('.stats__wrapper');
    if (!statsSection) return;
    
    const scrollTop = window.scrollY;
    const statsTop = statsSection.offsetTop;
    const statsHeight = statsSection.offsetHeight;
    
    // Only apply effect when stats section is in view
    if (scrollTop >= statsTop - window.innerHeight && scrollTop <= statsTop + statsHeight) {
      const progress = (scrollTop - (statsTop - window.innerHeight)) / (statsHeight + window.innerHeight);
      const translateY = 100 - (progress * 100);
      
      const statsDesc = document.querySelector('.stats__wrapper .desc');
      if (statsDesc) {
        statsDesc.style.transform = `translateY(${Math.max(0, translateY)}px)`;
      }
    }
  }
  
  // Handle mobile menu
  function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu__btn a');
    const mobileMenu = document.querySelector('.right__part');
    
    if (menuBtn) {
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (this.classList.contains('opened')) {
          this.classList.remove('opened');
          if (mobileMenu) {
            mobileMenu.style.top = '-100%';
          }
          document.body.style.overflow = 'auto';
        } else {
          this.classList.add('opened');
          if (mobileMenu) {
            mobileMenu.style.top = '0px';
          }
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }
  
  // Newsletter popup functionality
  function setupNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    const closeButton = document.querySelector('.close-popup');
    const subscribeButtons = document.querySelectorAll('.newsletter-subscribe-btn');
    
    if (!popup) return;
    
    // Show popup when subscribe buttons are clicked
    subscribeButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        popup.classList.add('show');
      });
    });
    
    // Close popup when close button is clicked
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        popup.classList.remove('show');
      });
    }
    
    // Close popup when clicking outside content
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        popup.classList.remove('show');
      }
    });
  }
  
  // Initialize all functions
  function init() {
    // Add scroll event listeners
    window.addEventListener('scroll', function() {
      handleHeaderScroll();
      animateOnScroll();
      handleStatsParallax();
    });
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup newsletter popup
    setupNewsletterPopup();
    
    // Trigger scroll functions once on load
    handleHeaderScroll();
    animateOnScroll();
    handleStatsParallax();
  }
  
  // Run initialization
  init();
});