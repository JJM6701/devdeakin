import React, { useEffect, useState } from "react";
import CardCollection from "./CardCollection";
import HeaderImage from "./HeaderImage";
import EmailForm from "./EmailForm";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
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

    fetchPosts();
  }, []);

  return (
    <>
      <HeaderImage />

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

      <EmailForm />
    </>
  );
};

export default HomePage;
