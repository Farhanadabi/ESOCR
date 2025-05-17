document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Create a status div to show messages to the user
  const formStatusDiv = document.createElement('div');
  formStatusDiv.className = 'form-status';
  form.appendChild(formStatusDiv);

  // Update the form action to use Formspree
  form.action = "https://formspree.io/f/your-formspree-id"; // Replace with your Formspree ID
  form.method = "POST";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending...';
    formStatusDiv.innerHTML = '';
    
    // Validate reCAPTCHA
    const captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
      formStatusDiv.innerHTML = '<div class="error">Please complete the CAPTCHA verification</div>';
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
      return;
    }

    // Basic client-side validation
    const name = form.querySelector("#name").value.trim();
    const discordId = form.querySelector("#Discord-id").value.trim();
    const esoId = form.querySelector("#eso-id").value.trim();
    const serviceRequest = form.querySelector("#service").value.trim();

    if (!name || !discordId || !esoId || !serviceRequest) {
      formStatusDiv.innerHTML = '<div class="error">All fields are required</div>';
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
      return;
    }

    // Prepare data to send to Formspree
    const formData = new FormData(form);
    formData.append('g-recaptcha-response', captchaResponse);
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        // Success - show message and reset form
        formStatusDiv.innerHTML = '<div class="success">Service request sent successfully! We will contact you shortly.</div>';
        form.reset();
        grecaptcha.reset();
      } else {
        formStatusDiv.innerHTML = `<div class="error">${responseData.error || 'Failed to submit. Please try again.'}</div>`;
      }
    } catch (error) {
      console.error("Error:", error);
      formStatusDiv.innerHTML = '<div class="error">Failed to submit. Please try again.</div>';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
    }
  });
});
