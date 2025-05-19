document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Create a status div to show messages to the user
  const formStatusDiv = document.createElement('div');
  formStatusDiv.className = 'form-status';
  form.appendChild(formStatusDiv);

  // Add animation classes to elements
  document.querySelector('.header').classList.add('animate-fadeInUp');
  document.querySelectorAll('.services h3').forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
    el.classList.add('animate-fadeInUp');
  });

  // Form validation - enhanced with better UX
  const validateField = (field) => {
    const value = field.value.trim();
    const fieldName = field.getAttribute('id');
    const label = document.querySelector(`label[for="${fieldName}"]`);
    
    if (!value) {
      field.classList.add('error-field');
      return false;
    } else {
      field.classList.remove('error-field');
      return true;
    }
  };

  // Add event listeners for real-time validation
  const formInputs = form.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('error-field')) {
        validateField(input);
      }
    });
  });

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset error states
    formStatusDiv.innerHTML = '';
    formInputs.forEach(input => input.classList.remove('error-field'));
    
    // Validate all fields
    let isValid = true;
    formInputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    // Validate reCAPTCHA
    const captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
      formStatusDiv.innerHTML = '<div class="error">Please complete the CAPTCHA verification</div>';
      isValid = false;
    }
    
    // If validation fails, stop here
    if (!isValid) {
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = 'Sending... <span class="loading-spinner"></span>';
    
    // Get form data
    const name = form.querySelector("#name").value.trim();
    const discordId = form.querySelector("#Discord-id").value.trim();
    const esoId = form.querySelector("#eso-id").value.trim();
    const serviceRequest = form.querySelector("#service").value.trim();

    // Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1373403157400518727/5r2PUhfH9yoHosH3YmJQA7E93YsZI9Ofu9KBBc6xcvBN8d0b3zgEXNRPt8g8U7qFgGS3';
    
    // Format message for Discord
    const discordPayload = {
      content: null,
      embeds: [{
        title: "🎮 New ESO Carry Service Request",
        color: 15844927, // Gold color
        fields: [
          {
            name: "👤 Name",
            value: name,
            inline: true
          },
          {
            name: "🔊 Discord ID",
            value: discordId,
            inline: true
          },
          {
            name: "🎯 ESO In-Game ID",
            value: esoId,
            inline: true
          },
          {
            name: "📋 Service Request",
            value: serviceRequest
          },
          {
            name: "⏰ Timestamp",
            value: new Date().toLocaleString()
          }
        ],
        footer: {
          text: "ESO Carry Runs Form Submission"
        }
      }]
    };
    
    try {
      // Using fetch API to send data to Discord webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload)
      });
      
      if (response.ok) {
        // Success message with animation
        formStatusDiv.innerHTML = '<div class="success">🎉 Service request sent successfully! We will contact you shortly via Discord.</div>';
        form.reset();
        grecaptcha.reset();
        
        // Scroll to the success message
        formStatusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      formStatusDiv.innerHTML = '<div class="error">❌ Failed to submit. Please try contacting us directly via Discord or try again later.</div>';
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
  
  // Enhance tables with better styling
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-container';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
  
  // Make tables sortable (optional feature)
  const makeSortable = (table) => {
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const isNumeric = rows.every(row => {
          const cell = row.cells[index].textContent;
          return !isNaN(parseFloat(cell)) && isFinite(cell);
        });
        
        rows.sort((a, b) => {
          const aValue = a.cells[index].textContent;
          const bValue = b.cells[index].textContent;
          
          if (isNumeric) {
            return parseFloat(aValue) - parseFloat(bValue);
          } else {
            return aValue.localeCompare(bValue);
          }
        });
        
        rows.forEach(row => table.querySelector('tbody').appendChild(row));
      });
      
      // Add sorting cursor and hint
      header.style.cursor = 'pointer';
      header.title = 'Click to sort';
    });
  };
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
