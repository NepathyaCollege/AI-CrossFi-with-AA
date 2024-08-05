import nodemailer from "nodemailer";
import successHandler from "../../common/successHandler";
import errorHandler from "../../common/errorHandler";

// Function to generate a random OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` if using port `465`
  auth: {
    user: "superhack206@gmail.com", // Replace with your email
    pass: "qyba vltd qgtx xits", // Replace with your app password
  },
});

// Function to send OTP
export async function sendOTP(email, otp) {
  const mailOptions = {
    from: "superhack206@gmail.com", // Replace with your email
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return successHandler({ message: `OTP ${otp} sent to ${email}` }, 201);
  } catch (error) {
    console.error(`Error sending OTP to ${email}:`, error);
    return errorHandler({ message: "Failed to send OTP" }, 500);
  }
}
