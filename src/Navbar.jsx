import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to sign out");
    }
  };

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
      <div style={styles.title}>
        <Link to="/" style={styles.links}>
          DEV@Deakin
        </Link>
      </div>
      <div>
        <input type="text" placeholder="Search..." style={styles.search} />
      </div>
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
