// Replace 'YOUR_BOT_TOKEN' with your actual Telegram bot token
const BOT_TOKEN = '6387727238:AAHTSxvq4m-I7yyYFXXOGZuV_R8SYLt1Q-g';

function generateOTP() {
    // Get the Telegram username entered by the user
    var username = document.getElementById("username").value;

    // Generate a random 6-digit OTP
    var otp = Math.floor(100000 + Math.random() * 900000);

    // Display the OTP in the OTP input field
    document.getElementById("otp").value = otp;

    // Send the OTP to the Telegram username using Telegram Bot API
    sendOTPToTelegram(username, otp);
}

function sendOTPToTelegram(username, otp) {
    // Compose the message to be sent
    var message = 'Your OTP: ' + otp;

    // Construct the API URL
    var apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Prepare the request data
    var requestData = {
        chat_id: username,
        text: message
    };

    // Send the request to Telegram Bot API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok) {
                console.log("OTP sent successfully to", username);
            } else {
                console.error("Failed to send OTP to", username);
            }
        })
        .catch(error => {
            console.error("Error sending OTP:", error);
        });
}
