// src/lib/email.js
import axios from 'axios';
import nodemailer from 'nodemailer';

// Create transporter once
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_SERVER,
  port: process.env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASSWORD
  }
});

export async function subscribeToNewsletter(email) {
  try {
    const isSubscribed = await isEmailSubscribed(email);
    if (isSubscribed) {
      return {
        success: false,
        message: 'Email already subscribed.'
      };
    }

    await addSubscriber(email);
    await sendWelcomeEmail(email);

    return {
      success: true,
      message: 'Successfully subscribed to newsletter!'
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
}

async function isEmailSubscribed(email) {
  try {
    console.log(process.env.BREVO_SMTP_API_KEY)
    const response = await axios.get(`https://api.brevo.com/v3/contacts/${email}`, {
      headers: {
        'api-key': process.env.BREVO_SMTP_API_KEY,
        'Content-Type': 'application/json' 
      }
    });
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 404) return false;
    throw error;
  }
}

async function addSubscriber(email) {
  await axios.post('https://api.brevo.com/v3/contacts', {
    email,
    listIds: [2], // Make sure this is your correct list ID
    updateEnabled: true
  }, {
    headers: {
      'api-key': process.env.BREVO_SMTP_API_KEY,
      'Content-Type': 'application/json'
    }
  });
}

async function sendWelcomeEmail(email) {
  try {
    // Using nodemailer
    await transporter.sendMail({
      from: '"Atakan\'s Blog" <no-reply@atakangul.com>',
      to: email,
      subject: 'Welcome to Our Newsletter!',
      text: 'Thank you for subscribing to our newsletter. Stay tuned for updates!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Atakan's Blog Newsletter!</h2>
          <p>Thank you for subscribing to our newsletter. You'll be receiving updates about:</p>
          <ul>
            <li>New blog posts</li>
            <li>Tech insights</li>
            <li>Special announcements</li>
          </ul>
          <p>Stay tuned for exciting content!</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}