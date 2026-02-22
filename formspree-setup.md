# Formspree Integration Guide for Zentrix Media Website

This guide outlines how to replace the current `mailto:` forms with Formspree for better form handling, success/error states, and improved user experience.

## 1. Create a Formspree Account

1. Go to [Formspree.io](https://formspree.io/) and sign up for an account
2. Create a new form for each of the forms on the website:
   - Book Call Application Form
   - Contact Form
   - Newsletter Subscription Form

## 2. Update the Book Call Form

Replace the current form in `book-call.html` (line 86):

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="application-form">
    <div class="form-grid">
        <div class="form-group">
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <!-- Other form fields remain the same -->
    </div>

    <div class="form-submit">
        <button type="submit" class="btn primary">Submit Application</button>
    </div>
    
    <!-- Add success/error message containers -->
    <div id="form-success" style="display: none; margin-top: 1rem; padding: 1rem; background-color: rgba(39, 174, 96, 0.1); border-left: 4px solid #27ae60; border-radius: 0 4px 4px 0;">
        <p style="margin: 0; color: #27ae60;">Your application has been submitted successfully! We'll be in touch soon.</p>
    </div>
    
    <div id="form-error" style="display: none; margin-top: 1rem; padding: 1rem; background-color: rgba(231, 76, 60, 0.1); border-left: 4px solid #e74c3c; border-radius: 0 4px 4px 0;">
        <p style="margin: 0; color: #e74c3c;">There was an error submitting your application. Please try again.</p>
    </div>
</form>
```

## 3. Update the Contact Form

Replace the current form in `contact.html` (line 280):

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="contact-form">
    <div class="form-group">
        <label for="name">Full Name:</label>
        <input type="text" id="name" name="name" required>
    </div>
    <!-- Other form fields remain the same -->

    <div class="form-submit">
        <button type="submit" class="btn primary">Send Message</button>
    </div>
    
    <!-- Add success/error message containers -->
    <div id="form-success" style="display: none; margin-top: 1rem; padding: 1rem; background-color: rgba(39, 174, 96, 0.1); border-left: 4px solid #27ae60; border-radius: 0 4px 4px 0;">
        <p style="margin: 0; color: #27ae60;">Your message has been sent successfully! We'll be in touch soon.</p>
    </div>
    
    <div id="form-error" style="display: none; margin-top: 1rem; padding: 1rem; background-color: rgba(231, 76, 60, 0.1); border-left: 4px solid #e74c3c; border-radius: 0 4px 4px 0;">
        <p style="margin: 0; color: #e74c3c;">There was an error sending your message. Please try again.</p>
    </div>
</form>
```

## 4. Update the Newsletter Form

Replace the current form in `insights.html` (line 377):

```html
<form class="newsletter-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="newsletter-form">
    <input type="email" name="email" placeholder="Enter your email address" required>
    <button type="submit">Subscribe</button>
    
    <!-- Add hidden success message that will be shown via JS -->
    <div id="newsletter-success" style="display: none; margin-top: 1rem; text-align: center; padding: 0.5rem; background-color: rgba(39, 174, 96, 0.1); border-radius: 4px;">
        <p style="margin: 0; color: #27ae60;">You're in! Check your email for the AI Funnel Blueprint.</p>
    </div>
</form>
```

## 5. Add JavaScript for Form Handling

Add the following code to `assets/js/script.js`:

```javascript
// Form handling with Formspree
const setupFormHandling = () => {
    // Application form
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(applicationForm);
            
            fetch(applicationForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById('form-success').style.display = 'block';
                    applicationForm.reset();
                    // Track event
                    if (typeof gtag === 'function') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Application',
                            'event_label': 'Book Call Form'
                        });
                    }
                } else {
                    document.getElementById('form-error').style.display = 'block';
                }
            })
            .catch(error => {
                document.getElementById('form-error').style.display = 'block';
                console.error('Error:', error);
            });
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById('form-success').style.display = 'block';
                    contactForm.reset();
                    // Track event
                    if (typeof gtag === 'function') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Contact',
                            'event_label': 'Contact Form'
                        });
                    }
                } else {
                    document.getElementById('form-error').style.display = 'block';
                }
            })
            .catch(error => {
                document.getElementById('form-error').style.display = 'block';
                console.error('Error:', error);
            });
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(newsletterForm);
            
            fetch(newsletterForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById('newsletter-success').style.display = 'block';
                    newsletterForm.style.display = 'none';
                    // Track event
                    if (typeof gtag === 'function') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Newsletter',
                            'event_label': 'Newsletter Subscription'
                        });
                    }
                    
                    // Offer download link after 2 seconds
                    setTimeout(() => {
                        const downloadLink = document.createElement('div');
                        downloadLink.innerHTML = `
                            <div style="margin-top: 1rem; text-align: center;">
                                <a href="#" class="btn primary" style="display: inline-block;">Download AI Funnel Blueprint</a>
                            </div>
                        `;
                        document.getElementById('newsletter-success').after(downloadLink);
                    }, 2000);
                } else {
                    alert('There was an error subscribing to the newsletter. Please try again.');
                }
            })
            .catch(error => {
                alert('There was an error subscribing to the newsletter. Please try again.');
                console.error('Error:', error);
            });
        });
    }
};

// Call the function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Setup form handling
    setupFormHandling();
});
```

## 6. Add Spam Protection

Formspree provides built-in spam protection, but you can enhance it with a honeypot field:

Add this to each form:

```html
<!-- Honeypot field to prevent spam -->
<div style="position: absolute; left: -9999px;">
    <label for="honeypot">Leave this field empty</label>
    <input type="text" name="_gotcha" id="honeypot">
</div>
```

## 7. Implementation Steps

1. Sign up for Formspree and create the necessary forms
2. Replace the form action URLs with your Formspree form IDs
3. Add the success/error message containers to each form
4. Add the JavaScript code to handle form submissions
5. Test each form to ensure proper functionality
6. Monitor submissions in your Formspree dashboard

## 8. Additional Considerations

- Consider adding reCAPTCHA if spam becomes an issue
- Set up email notifications in Formspree to receive alerts for new submissions
- Configure form redirects if needed for specific user flows
- Add form analytics to track conversion rates
