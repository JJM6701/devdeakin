import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import HomePage from "./HomePage";
import NewPostPage from "./NewPostPage";
import QuestionPage from "./QuestionPage";
import Footer from "./Footer";
import ArticlesPage from "./ArticlePage";
import VideoPage from "./VideoPage";
import CheckoutPage from "./CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PrivateRoute from "./PrivateRoute";
import PlansPage from "./PlansPage";

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

export default App;
