// Newsletter Popup and MailerLite Integration
document.addEventListener('DOMContentLoaded', function() {
    // MailerLite API token
    const MAILERLITE_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMmMxYzVmNWU0MWFkNGYzZjM0YjE1NDExODBjNmQ4NzdhYmE4NTA4OWU4NzRlY2FjZGUzM2M4NDFjNjBiZjM5YmI4MGM2OTI1MDMxY2MzYjUiLCJpYXQiOjE3NDQ5Njk4MDUuNjgxNTYyLCJuYmYiOjE3NDQ5Njk4MDUuNjgxNTY2LCJleHAiOjQ5MDA2NDM0MDUuNjc1OTA1LCJzdWIiOiI4NjUyNDYiLCJzY29wZXMiOltdfQ.PIH6lsK15G5wVPMA4jUnBKX014CJhE6B4nmAnBYrcysYtchnERXndNn6TOd5tH0usyiLxgIl6IxEk5fdGRM-wdToWA4_dHvO3NI1GiBSp4lAPSCFcCaM8G7_q957lGPxTjMd0FIt7bP7egl9JaBlZ095iDxlf8DH14LN1XnI9ysyCbTtI1CiKC1IYiQVt4wVqP28bumdLmD31dQ79nxhZD_Xa4eXOnEd7126zHLguGzZ5RQg_CXBesdCRtNpgk51CZgbWJlBwCRu4ZBJ1xAyN66K6kaHsQdNnCR6DphEml8GfCuYy6gPuMOHlG13yJPl1Ta-D_XWPNKNocULPPJL-rP8wnqgB-sU6T9qobmtFp5ms9RUOTzFL_As4A-DpdRpQW_8VvpmIh8uLXswBM5gUNndS6BmpNvxCwqIyUzZYc3o-JQkKYCQW3h5d7gjEC4u6hiIDa_Yc7O1Em2G7BWWKIWpMmNDmvmL1kpamTbnQDUGxsPrDa_6znMQO7LpAe6q99iz4-_Jx-xXphdtFxmb2aSn2gLP9NmMha4HHL8uKZ2P0T0iDnBXAtHmOOFJphyP_tXfwCjE-S1fqxQgvMGQJ0AQdieqyPcgT1ymMOaJa74CpZu0257MUFDYVTJH54XLJIdMddL1yCC4pqO3w5tR40po9a56cCtQ3_Pbqyt_Z0Y';
    
    // DOM Elements
    const popup = document.getElementById('newsletter-popup');
    const closeButton = document.querySelector('.close-popup');
    const form = document.getElementById('newsletter-form');
    const formMessage = document.querySelector('.form-message');
    
    // Simple function to show the popup
    function showPopup() {
        if (popup) {
            popup.classList.add('show');
        }
    }
    
    // Attach event listeners to all Subscribe buttons
    document.addEventListener('click', function(e) {
        // Find clicked element
        const target = e.target;
        
        // Check if it's a subscribe button (by text content or class)
        if ((target.tagName === 'A' && target.textContent.trim() === 'Subscribe') || 
            target.classList.contains('newsletter-subscribe-btn') || 
            target.id === 'cta-subscribe-btn') {
            
            e.preventDefault();
            showPopup();
        }
    });
    
    // Close popup when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            popup.classList.remove('show');
        });
    }
    
    // Close popup when clicking outside the popup content
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.classList.remove('show');
            }
        });
    }
    
    // Handle form submission with MailerLite API
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            // Validate form fields
            if (!name || !email) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = form.querySelector('.submit-btn');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Prepare subscriber data for MailerLite API
            const subscriberData = {
                email: email,
                fields: {
                    name: name
                },
                groups: ["newsletter_subscribers"],
                status: "active"
            };
            
            // Submit to MailerLite API
            fetch('https://api.mailerlite.com/api/v2/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MailerLite-ApiKey': MAILERLITE_TOKEN
                },
                body: JSON.stringify(subscriberData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Success
                showMessage('Thank you for subscribing!', 'success');
                form.reset();
                
                // Close popup after 3 seconds
                setTimeout(() => {
                    popup.classList.remove('show');
                    // Reset form message
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 3000);
            })
            .catch(error => {
                // Error
                console.error('Error:', error);
                showMessage('Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
    
    // Helper function to show form messages
    function showMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message';
            formMessage.classList.add(type);
        }
    }
});