import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { clientSecret } = location.state;
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setPaymentStatus(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentStatus("Payment succeeded!");

      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { plan: "premium" }, { merge: true });
      }
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    cardElementContainer: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    cardElement: {
      style: {
        base: {
          fontSize: "16px",
          color: "#424770",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      backgroundColor: "#28a745",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
      border: "none",
      transition: "background-color 0.3s",
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    success: {
      marginTop: "20px",
      color: "green",
    },
    error: {
      marginTop: "20px",
      color: "red",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Checkout</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.cardElementContainer}>
          <CardElement options={styles.cardElement} />
        </div>
        <button type="submit" disabled={!stripe} style={styles.button}>
          Pay $100
        </button>
      </form>
      {paymentStatus && (
        <p
          style={
            paymentStatus.includes("succeeded") ? styles.success : styles.error
          }
        >
          {paymentStatus}
        </p>
      )}
    </div>
  );
};

export default CheckoutPage;
