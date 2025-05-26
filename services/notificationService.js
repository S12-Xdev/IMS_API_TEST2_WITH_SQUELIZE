const twilio = require("twilio");
const nodemailer = require("nodemailer");

// Load environment variables
const dotenv = require("dotenv");

dotenv.config();

// Load credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const client = new twilio(accountSid, authToken);

// Function to send OTP via SMS
exports.sendOTPSMS = async (toPhoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    });

    console.log("OTP SMS sent:", message.sid);
    return message;
  } catch (error) {
    console.error("Failed to send OTP SMS:", error);
    throw error;
  }
}

// Function to send email
exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: emailUser,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
