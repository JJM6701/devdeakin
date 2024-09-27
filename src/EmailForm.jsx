import React, { useState } from "react";
import axios from "axios"; // Library for making HTTP requests
import { collection, addDoc } from "firebase/firestore"; // Firestore methods for adding documents
import { db } from "./firebase"; // Firebase database reference

const EmailForm = () => {
  const styles = {
    container: {
      width: "100%",
      backgroundColor: "#333",
      padding: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderBottom: "1px solid #ccc",
    },
    title: {
      color: "#fff",
      marginRight: "20px",
    },
    form: {
      display: "flex",
      alignItems: "center",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      color: "#333",
      marginRight: "10px",
      width: "300px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#666",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    message: {
      marginLeft: "20px",
      color: "#777",
    },
  };

  const [email, setEmail] = useState(""); // State for storing the email input
  const [message, setMessage] = useState(""); // State for storing feedback message

  // Handle form submission for email subscription
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send email to the subscription API
      const response = await axios.post(
        "/.netlify/functions/email-subscription",
        { email }
      );

      // Add email to Firestore collection
      await addDoc(collection(db, "newsletterEmails"), {
        email: email,
        timestamp: new Date(),
      });

      // Set success message
      setMessage(response.data.message);
    } catch (error) {
      // Set error message if the request fails
      setMessage("Error sending email");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up For Our Daily Insider</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Subscribe
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}{" "}
      {/* Display feedback message */}
    </div>
  );
};

export default EmailForm;
