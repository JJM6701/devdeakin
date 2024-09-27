import React, { useEffect, useState } from "react";
import CardCollection from "./CardCollection"; // Component for displaying a collection of posts
import HeaderImage from "./HeaderImage"; // Component for displaying the header image
import EmailForm from "./EmailForm"; // Component for the email subscription form
import { getDocs, collection, query, where } from "firebase/firestore"; // Firestore methods for fetching data
import { db } from "./firebase"; // Firebase database reference

const HomePage = () => {
  const [articles, setArticles] = useState([]); // State for storing articles
  const [videos, setVideos] = useState([]); // State for storing videos
  const [questions, setQuestions] = useState([]); // State for storing questions

  useEffect(() => {
    // Fetch posts from Firestore and update states
    const fetchPosts = async () => {
      const articlesQuery = query(
        collection(db, "posts"),
        where("type", "==", "article")
      );
      const articlesSnapshot = await getDocs(articlesQuery);
      setArticles(articlesSnapshot.docs.map((doc) => doc.data()));

      const videosQuery = query(
        collection(db, "posts"),
        where("type", "==", "video")
      );
      const videosSnapshot = await getDocs(videosQuery);
      setVideos(videosSnapshot.docs.map((doc) => doc.data()));

      const questionsQuery = query(
        collection(db, "posts"),
        where("type", "==", "question")
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      setQuestions(questionsSnapshot.docs.map((doc) => doc.data()));
    };

    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []); // Empty dependency array ensures this effect runs once

  return (
    <>
      {/* Display the header image */}
      <HeaderImage />

      {/* Display the collections of articles, videos, and questions */}
      <CardCollection
        collectionName="Articles"
        permalink="/articles"
        postType="article"
      />

      <CardCollection
        collectionName="Tutorials"
        permalink="/videos"
        postType="video"
      />

      <CardCollection
        collectionName="Questions"
        permalink="/questions"
        postType="question"
      />

      {/* Display the email subscription form */}
      <EmailForm />
    </>
  );
};

export default HomePage;
