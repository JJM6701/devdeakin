import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Firebase services
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation
import axios from "axios"; // Library for making HTTP requests

const PlansPage = () => {
  const [userStatus, setUserStatus] = useState(null); // State for storing user's subscription plan
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch the current user's plan status from Firestore
    const fetchUserStatus = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserStatus(userSnap.data().plan); // Update user status based on Firestore data
        }
      }
    };
    fetchUserStatus(); // Call the function on component mount
  }, []);

  const handlePremiumUpgrade = async () => {
    try {
      // Create a payment intent for upgrading to premium
      const { data } = await axios.post(
        "/.netlify/functions/create-payment-intent",
        { amount: 10000 } // Amount in cents for a $100 payment
      );

      const { clientSecret } = data;
      navigate("/checkout", { state: { clientSecret } }); // Redirect to the checkout page with payment details
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Failed to create payment intent. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Choose Your Plan</h1>

      {/* Free Plan section */}
      <div style={styles.plan}>
        <h2>Free Plan</h2>
        <p>Access to basic features for free.</p>
        <p>
          Status:{" "}
          {userStatus === "free"
            ? "Currently on Free Plan"
            : "Currently on Premium Plan"}
        </p>
      </div>

      {/* Premium Plan section */}
      <div style={styles.plan}>
        <h2>Premium Plan</h2>
        <p>Unlock premium features for $100 (one-time payment).</p>
        {userStatus === "premium" ? (
          <p>You are already a Premium user!</p> // Display message if the user is already a premium member
        ) : (
          <button style={styles.button} onClick={handlePremiumUpgrade}>
            Upgrade to Premium
          </button> // Button to initiate the premium upgrade
        )}
      </div>
    </div>
  );
};

// Inline styles for the plan sections and buttons
const styles = {
  plan: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "20px",
    margin: "20px 0",
    backgroundColor: "#f9f9f9",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PlansPage;
