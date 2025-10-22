// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Create mailto link
            const mailtoLink = createMailtoLink(name, email, subject, message);
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormMessage('Thank you! Your email client should open with a pre-filled message. If it doesn\'t open automatically, please email us directly at ssujit905@gmail.com', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function createMailtoLink(name, email, subject, message) {
    const subjectLine = `Convertify Contact: ${getSubjectText(subject)}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nThis message was sent from Convertify Contact Form (https://ssujit905.github.io/convertify/contact.html)`;
    
    return `mailto:ssujit905@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
}

function getSubjectText(subjectValue) {
    const subjects = {
        'general': 'General Inquiry',
        'support': 'Technical Support',
        'feedback': 'Tool Feedback',
        'partnership': 'Partnership Opportunity',
        'bug': 'Bug Report',
        'other': 'Other Inquiry'
    };
    
    return subjects[subjectValue] || 'General Inquiry';
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message form-message-${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 10 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 10000);
}
