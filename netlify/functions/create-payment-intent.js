const Stripe = require("stripe");
const stripe = Stripe(process.env.VITE_STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  try {
    // Parse the request body for the payment amount
    const { amount } = JSON.parse(event.body);

    // Create a payment intent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "aud",
    });

    // Return the client secret of the payment intent
    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    // Return error message on failure
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
