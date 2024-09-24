import React, { useState } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

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

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/.netlify/functions/email-subscription",
        { email }
      );

      await addDoc(collection(db, "newsletterEmails"), {
        email: email,
        timestamp: new Date(),
      });

      setMessage(response.data.message);
    } catch (error) {
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
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default EmailForm;
