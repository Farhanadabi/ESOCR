document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Create a status div to show messages to the user
  const formStatusDiv = document.createElement('div');
  formStatusDiv.className = 'form-status';
  form.appendChild(formStatusDiv);

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

    // Prepare data to send to Telegram
    const botToken = '7760087813:AAFK6GlkyPZOSojVQunfZKFw_1oSCmbGWjo';
    const chatId = '33180592';
    
    // Format the message
    const message = `
📢 New Service Request:
👤 Name: ${name}
💬 Discord ID: ${discordId}
🎮 ESO In-Game ID: ${esoId}
📋 Service Request: ${serviceRequest}
⏰ Time: ${new Date().toLocaleString()}
    `;

    // Using a CORS proxy to avoid CORS issues
    const telegramApiUrl = `https://cors-anywhere.herokuapp.com/https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });
      
      const responseData = await response.json();
      
      if (responseData.ok) {
        // Success - show message and reset form
        formStatusDiv.innerHTML = '<div class="success">Service request sent successfully! We will contact you shortly.</div>';
        form.reset();
        grecaptcha.reset();
      } else {
        formStatusDiv.innerHTML = '<div class="error">Failed to send your request. Please try again later or contact us directly via Discord.</div>';
        console.error("Telegram API error:", responseData);
      }
    } catch (error) {
      console.error("Error:", error);
      formStatusDiv.innerHTML = '<div class="error">Failed to submit. Please try contacting us directly via Discord.</div>';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
    }
  });
});
