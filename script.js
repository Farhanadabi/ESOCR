const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResponse();
    
    if (captchaResponse.length === 0) {
        alert('Please Fill the Captcha!');
        return;
    }

    // Collect form data
    const name = form.querySelector("#name").value;
    const discordId = form.querySelector("#Discord-id").value;
    const esoId = form.querySelector("#eso-id").value;
    const serviceRequest = form.querySelector("#service").value;

    // Telegram bot credentials
    const botToken = "7760087813:AAEzxaKOvuIhVCf7v-72sWb3ZhAZ_FAGfjI";
    const chatId = "33180592";

    // Construct the message
    const message = `
📢 New Service Request:
👤 Name: ${name}
💬 Discord ID: ${discordId}
🎮 ESO In-Game ID: ${esoId}
📋 Service Request:
${serviceRequest}
    `;

    // Send message to Telegram
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: message,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.ok) {
                alert("Service request sent successfully!");
            } else {
                alert("Failed to send service request. Please try again.");
                console.error("Telegram API Error:", data);
            }
        })
        .catch((error) => {
            alert("An error occurred. Please try again.");
            console.error("Fetch Error:", error);
        });
});
