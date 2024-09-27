import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importing necessary components for routing
import Navbar from "./Navbar"; // Navigation bar component
import LoginPage from "./LoginPage"; // Login page component
import SignUpPage from "./SignUpPage"; // Signup page component
import HomePage from "./HomePage"; // Home page component
import NewPostPage from "./NewPostPage"; // New post creation page component
import QuestionPage from "./QuestionPage"; // Question page component
import Footer from "./Footer"; // Footer component
import ArticlesPage from "./ArticlePage"; // Articles page component
import VideoPage from "./VideoPage"; // Video page component
import CheckoutPage from "./CheckoutPage"; // Checkout page component
import { Elements } from "@stripe/react-stripe-js"; // Stripe Elements for payment integration
import { loadStripe } from "@stripe/stripe-js"; // Load Stripe for use with Stripe API
import PrivateRoute from "./PrivateRoute"; // Private route component for authenticated access
import PlansPage from "./PlansPage"; // Plans page component

// Initialize Stripe with the public test key
const stripePromise = loadStripe(
  "pk_test_51Q2A5jP6QkvS34Xaw8dXXlAFxrxqG3QFxhTNW94NcBzt0P38COYvUSejavaSkmOuXi78XwJWhneyycWAsZh5W3Ya00jjy9nRg6"
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/post" element={<NewPostPage />} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/videos" element={<VideoPage />} />
        <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <CheckoutPage />
            </Elements>
          }
        />
        <Route
          path="/plans"
          element={
            <PrivateRoute>
              <PlansPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App; // Export the App component as the default export
