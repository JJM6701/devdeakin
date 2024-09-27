import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Navigation and linking components
import { auth } from "./firebase"; // Firebase authentication
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase method for email/password login

function LoginPage() {
  const [email, setEmail] = useState(""); // State to store the user's email
  const [password, setPassword] = useState(""); // State to store the user's password
  const navigate = useNavigate(); // Hook for navigating between pages

  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password); // Attempt to sign in with email and password
      navigate("/"); // Redirect to the homepage on successful login
    } catch (error) {
      alert("Invalid email or password"); // Show error message if login fails
    }
  };

  // Inline styles for the login form layout and elements
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
    signupLink: {
      marginTop: "10px",
      textAlign: "center",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      {/* Login form */}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        {/* Link to signup page */}
        <p style={styles.signupLink}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
