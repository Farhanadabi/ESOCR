document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const formStatusDiv = document.createElement('div');
  formStatusDiv.className = 'form-status';
  form.appendChild(formStatusDiv);

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending... <span class="loading-spinner"></span>';
    formStatusDiv.innerHTML = '';

    const captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
      formStatusDiv.innerHTML = '<div class="error">Please complete the CAPTCHA verification</div>';
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
      return;
    }

    const name = sanitizeInput(form.querySelector("#name").value.trim());
    const discordId = sanitizeInput(form.querySelector("#discord-id").value.trim());
    const esoId = sanitizeInput(form.querySelector("#eso-id").value.trim());
    const serviceRequest = sanitizeInput(form.querySelector("#service").value.trim());

    if (!name || !discordId || !esoId || !serviceRequest) {
      formStatusDiv.innerHTML = '<div class="error">All fields are required</div>';
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
      return;
    }

    const payload = {
      recaptchaToken: captchaResponse, // Send reCAPTCHA token to worker
      embeds: [{
        title: "New ESO Carry Service Request",
        color: 5814783,
        fields: [
          { name: "Name", value: name, inline: true },
          { name: "Discord ID", value: discordId, inline: true },
          { name: "ESO In-Game ID", value: esoId, inline: true },
          { name: "Service Request", value: serviceRequest },
          { name: "Timestamp", value: new Date().toLocaleString() }
        ],
        footer: { text: "ESO Carry Runs Form Submission" }
      }]
    };

    try {
      const response = await fetch('https://eso-form-handler.farhan-r-20139021.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        formStatusDiv.innerHTML = '<div class="success">Service request sent successfully! We will contact you shortly.</div>';
        form.reset();
        grecaptcha.reset();
      } else {
        throw new Error(result.error || `Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
      formStatusDiv.innerHTML = `<div class="error">Failed to submit: ${error.message}. Please try contacting us directly via Discord.</div>`;
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
    }
  });

  function sanitizeInput(input) {
    return input.replace(/[&<>"'`=\/]/g, '');
  }

  // Dark mode toggle (using in-memory storage for artifacts)
  const toggleBtn = document.querySelector('.dark-mode-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }
});
