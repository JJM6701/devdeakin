import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Link component for navigation
import { auth } from "./firebase"; // Firebase authentication
import { signOut, onAuthStateChanged } from "firebase/auth"; // Firebase auth methods
import { useNavigate } from "react-router-dom"; // Navigation hook

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [user, setUser] = useState(null); // State to store the logged-in user

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state when authentication changes
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to sign out");
    }
  };

  // Inline styles for the navbar layout and elements
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#f5f5f5",
      color: "#333",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      position: "sticky",
      top: 0,
      width: "100%",
      zIndex: 1000,
      boxSizing: "border-box",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
    search: {
      padding: "8px 10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      outline: "none",
      width: "250px",
      boxSizing: "border-box",
    },
    links: {
      marginLeft: "20px",
      color: "#333",
      textDecoration: "none",
      fontWeight: "500",
      padding: "10px",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    },
    linksHover: {
      backgroundColor: "#e0e0e0",
    },
    authSection: {
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <nav style={styles.navbar}>
      {/* Site title */}
      <div style={styles.title}>
        <Link to="/" style={styles.links}>
          DEV@Deakin
        </Link>
      </div>
      {/* Search bar */}
      <div>
        <input type="text" placeholder="Search..." style={styles.search} />
      </div>
      {/* Auth section with dynamic links */}
      <div style={styles.authSection}>
        <Link
          to="/plans"
          style={styles.links}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = styles.linksHover.backgroundColor)
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Plans
        </Link>

        {/* Show "Post" link only if the user is logged in */}
        {user && (
          <Link
            to="/post"
            style={styles.links}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                styles.linksHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Post
          </Link>
        )}
        {/* Display login or logout based on user authentication state */}
        {user ? (
          <a
            onClick={handleSignOut}
            style={styles.links}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                styles.linksHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Logout
          </a>
        ) : (
          <Link
            to="/login"
            style={styles.links}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                styles.linksHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
