document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking a nav link
    const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // FAQ accordion functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Get the content element that follows this toggle
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle visibility of content
            content.classList.toggle('hidden');
            
            // Rotate plus icon when expanded
            icon.classList.toggle('active');
            
            // Close other open FAQs
            faqToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherContent = otherToggle.nextElementSibling;
                    const otherIcon = otherToggle.querySelector('i');
                    
                    if (!otherContent.classList.contains('hidden')) {
                        otherContent.classList.add('hidden');
                        otherIcon.classList.remove('active');
                    }
                }
            });
        });
    });
    
    // Form validation and submission
    const appointmentForm = document.getElementById('appointment-form');
    const formSuccess = document.getElementById('form-success');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(event) {
            // Validate the form before submission
            if (!validateForm()) {
                event.preventDefault();
                return false;
            }
            
            // Add the +91 prefix to the phone number for submission
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                const formattedPhone = "+91" + phoneInput.value;
                // Create a temporary hidden input for the formatted phone
                const formattedPhoneInput = document.createElement('input');
                formattedPhoneInput.type = 'hidden';
                formattedPhoneInput.name = 'formatted_phone';
                formattedPhoneInput.value = formattedPhone;
                appointmentForm.appendChild(formattedPhoneInput);
            }
            
            // If using Formspree and the form is valid, handle submission
            // This code handles the form submission without page reload
            event.preventDefault();
            
            const formAction = appointmentForm.getAttribute('action');
            
            // Add a hidden honeypot field for spam protection
             const formData = new FormData(appointmentForm);
            const requiredFields = appointmentForm.querySelectorAll('[required]');
            const templateParams = {};
            requiredFields.forEach(field => {
            if (!field.value.trim()) {
                const fieldName = field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : 'This field';
                displayError(field, `${fieldName} is required`);
            }else if (field.type === 'email') {
                templateParams["customer_email"]= field.value;
                templeteParams["email"]= "shreyasbajjir082@gmail.com";
                templateParams["appointment_id"]= generateAppointmentId();
            } else if (field.id === 'phone') {
                templateParams["phone"]=field.value;
            }else if (field.id === 'service') {
                templateparams["service"]=field.value;                
            }else if (field.id === 'address') {
                templateparams["address"]=field.value;
            }else if (field.id === 'preferred_date') {
                templateparams["preferred_date"]=field.value;
            }else if (field.id === 'preferred_time') {
                templateparams["preferred_time"]=field.value;
            }else if (field.id === 'message') {
                templateparams["message"]=field.value;
            }
            

        })
           
           
        emailjs.send('service_1xm3pgh', 'template_7y6f677', templateParams)
        .then(function() {
            // Handle success (show thanks, redirect, clear form, etc.)
            window.location.href = 'thank-you.html';
        }, function(error) {
            // Handle failure
            console.error('EmailJS error:', error);
            showFormError('There was a problem submitting your form. Please try again later.');
        });
        });
                    
    }      
    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = appointmentForm.querySelectorAll('[required]');
        
        // Reset previous validation errors
        const errorElements = appointmentForm.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        
        // Check each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                const fieldName = field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : 'This field';
                displayError(field, `${fieldName} is required`);
                isValid = false;
            } else if (field.type === 'email' && !validateEmail(field.value)) {
                displayError(field, 'Please enter a valid email address (e.g., name@example.com)');
                isValid = false;
            } else if (field.id === 'phone') {
                if (field.value.length < 10) {
                    displayError(field, 'Phone number must be exactly 10 digits');
                    isValid = false;
                } else if (!validatePhone(field.value)) {
                    displayError(field, 'Phone number should contain only digits (0-9)');
                    isValid = false;
                }
            } else if (field.id === 'service' && field.selectedIndex === 0) {
                displayError(field, 'Please select a service');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Display error message below the field
    function displayError(field, message) {
        // Get the parent element - might be different for phone due to our custom layout
        let parent = field.parentNode;
        if (parent.classList.contains('flex')) {
            parent = parent.parentNode; // For phone field, go one level up
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.innerText = message;
        parent.appendChild(errorDiv);
        
        // Highlight the field with error
        field.classList.add('border-red-500');
        
        // For phone field, highlight the container too
        if (field.id === 'phone' && field.parentNode.classList.contains('flex')) {
            field.parentNode.classList.add('border-red-500');
        }
        
        // Remove error styling when user starts typing
        field.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            // For phone field, remove highlight from container too
            if (this.id === 'phone' && this.parentNode.classList.contains('flex')) {
                this.parentNode.classList.remove('border-red-500');
            }
            
            const parentElement = this.parentNode.classList.contains('flex') ? 
                this.parentNode.parentNode : this.parentNode;
            const error = parentElement.querySelector('.error-message');
            if (error) {
                error.remove();
            }
        });
        
        // Also remove error on dropdown change
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', function() {
                this.classList.remove('border-red-500');
                const error = this.parentNode.querySelector('.error-message');
                if (error) {
                    error.remove();
                }
            });
        }
    }
    
    // Show success message
    function showFormSuccess() {
        if (formSuccess) {
            formSuccess.classList.remove('hidden');
            formSuccess.textContent = "Thank you for booking an appointment! We will contact you shortly to confirm the details.";
            formSuccess.classList.add('bg-green-100', 'text-green-700');
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth' });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        }
    }
    
    // Show error message for form submission
    function showFormError(errorMessage) {
        if (formSuccess) {
            formSuccess.classList.remove('hidden', 'bg-green-100', 'text-green-700');
            formSuccess.textContent = errorMessage || "There was a problem submitting your form. Please try again later.";
            formSuccess.classList.add('bg-red-100', 'text-red-700');
            
            // Scroll to error message
            formSuccess.scrollIntoView({ behavior: 'smooth' });
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        }
    }

    function generateAppointmentId() {
        return 'APT-' + Date.now(); 
    }
    
    // Email validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Phone validation (10-digit Indian phone numbers)
    function validatePhone(phone) {
        const re = /^[0-9]{10}$/;
        return re.test(String(phone));
    }
    
    // Set minimum date for appointment to today
    const dateInput = document.getElementById('preferred_date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}); 