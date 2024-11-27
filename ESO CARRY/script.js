const form = document.querySelector('#contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResponse();

    if (captchaResponse.length === 0) {
        alert('Please fill the CAPTCHA!');
        return;
    }

    // Collect form data
    const name = form.querySelector("#name").value;
    const discordId = form.querySelector("#Discord-id").value;
    const esoId = form.querySelector("#eso-id").value;
    const serviceRequest = form.querySelector("#service").value;

    // Prepare data to send to the backend
    const data = {
        name,
        discordId,
        esoId,
        serviceRequest,
        captchaResponse,
    };

    try {
        const response = await fetch("http://localhost:8080/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (response.ok) {
            alert(responseData.message || 'Success!');
            form.reset(); // Reset the form if successful
        } else {
            alert(responseData.message || "An error occurred. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit. Please try again.");
    }
});
