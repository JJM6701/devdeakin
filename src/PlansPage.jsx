import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PlansPage = () => {
  const [userStatus, setUserStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserStatus(userSnap.data().plan);
        }
      }
    };
    fetchUserStatus();
  }, []);

  const handlePremiumUpgrade = async () => {
    try {
      const { data } = await axios.post(
        "/.netlify/functions/create-payment-intent",
        { amount: 10000 }
      );

      const { clientSecret } = data;
      navigate("/checkout", { state: { clientSecret } });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Failed to create payment intent. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Choose Your Plan</h1>

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

      <div style={styles.plan}>
        <h2>Premium Plan</h2>
        <p>Unlock premium features for $100 (one-time payment).</p>
        {userStatus === "premium" ? (
          <p>You are already a Premium user!</p>
        ) : (
          <button style={styles.button} onClick={handlePremiumUpgrade}>
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
};

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
