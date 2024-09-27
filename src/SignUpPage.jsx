import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function SignUpPage() {
  // Define state for user input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use react-router-dom's useNavigate hook for navigation after signup
  const navigate = useNavigate();

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Ensure that passwords match before proceeding
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Create user with Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Add user details to Firestore under the "users" collection
      await setDoc(doc(db, "users", userId), {
        firstName,
        lastName,
        email,
        plan: "free", // Default to the "free" plan for new users
      });

      // Navigate to the homepage after successful sign up
      navigate("/");
    } catch (error) {
      console.error("Error creating account:", error.message);
      alert("Error creating account: " + error.message);
    }
  };

  // Inline styles for the component
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "90vh",
      backgroundColor: "#f5f5f5",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      width: "300px",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    },
    input: {
      marginBottom: "10px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ddd",
    },
    button: {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#333",
      color: "white",
      cursor: "pointer",
      marginTop: "10px",
    },
    heading: {
      marginBottom: "20px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignUp} style={styles.form}>
        <h2 style={styles.heading}>Create a DEV@Deakin Account</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
