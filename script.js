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

    // Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1373403157400518727/5r2PUhfH9yoHosH3YmJQA7E93YsZI9Ofu9KBBc6xcvBN8d0b3zgEXNRPt8g8U7qFgGS3';
    
    // Format message for Discord
    const discordPayload = {
      content: null,
      embeds: [{
        title: "New ESO Carry Service Request",
        color: 5814783,
        fields: [
          {
            name: "Name",
            value: name,
            inline: true
          },
          {
            name: "Discord ID",
            value: discordId,
            inline: true
          },
          {
            name: "ESO In-Game ID",
            value: esoId,
            inline: true
          },
          {
            name: "Service Request",
            value: serviceRequest
          },
          {
            name: "Timestamp",
            value: new Date().toLocaleString()
          }
        ],
        footer: {
          text: "ESO Carry Runs Form Submission"
        }
      }]
    };
    
    try {
      // Using proper fetch API to send data to Discord webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload)
      });
      
      if (response.ok) {
        formStatusDiv.innerHTML = '<div class="success">Service request sent successfully! We will contact you shortly.</div>';
        form.reset();
        grecaptcha.reset();
      } else {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
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
