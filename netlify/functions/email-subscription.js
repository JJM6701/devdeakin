import mailgun from "mailgun-js";

const mg = mailgun({
  apiKey: process.env.VITE_MAILGUN_API_KEY,
  domain: process.env.VITE_MAILGUN_DOMAIN,
});

export async function handler(event, context) {
  try {
    const { email } = JSON.parse(event.body);

    const data = {
      from: "joshuamorrison35@gmail.com",
      to: email,
      subject: "Welcome to DEV@Deakin!",
      text: "Thank you for subscribing to DEV@Deakin.",
      html: "<strong>Thank you for subscribing to DEV@Deakin.</strong>",
    };

    await mg.messages().send(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Welcome email sent successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error sending email" }),
    };
  }
}
