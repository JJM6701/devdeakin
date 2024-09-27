import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // React Router components for navigation
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import { auth } from "./firebase"; // Firebase authentication

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null); // State to store the current user
  const [loading, setLoading] = useState(true); // Loading state to manage authentication check
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if authenticated
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
      setLoading(false); // Set loading to false once auth check is complete
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>; // Display loading message while checking authentication
  }

  // Render the children components if the user is authenticated, otherwise redirect to login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
