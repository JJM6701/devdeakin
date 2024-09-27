import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firebase methods for querying the Firestore database
import { db } from "./firebase"; // Firestore database reference
import CommentSection from "./CommentSection"; // Comment section component

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]); // State to store the list of articles
  const [loading, setLoading] = useState(true); // Loading state to manage the loading UI

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Query Firestore for documents where 'type' is 'article'
        const articlesRef = collection(db, "posts");
        const q = query(articlesRef, where("type", "==", "article"));
        const querySnapshot = await getDocs(q);

        // Map Firestore documents into the articles list
        const articlesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArticles(articlesList); // Update the articles state with fetched data
        setLoading(false); // Set loading to false once articles are loaded
      } catch (error) {
        console.error("Error fetching articles: ", error);
        setLoading(false); // Handle error and stop loading
      }
    };

    fetchArticles();
  }, []); // Empty dependency array to run the effect once on mount

  // Inline styles for layout and article formatting
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    article: {
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "#fff",
      padding: "20px",
      margin: "10px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    image: {
      maxWidth: "100%",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    date: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "10px",
    },
    abstract: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    content: {
      fontSize: "16px",
      marginBottom: "10px",
    },
    tags: {
      fontSize: "14px",
      color: "#333",
      fontStyle: "italic",
      marginBottom: "10px",
    },
  };

  // Show loading message while fetching articles
  if (loading) {
    return <div style={styles.container}>Loading articles...</div>;
  }

  // Display a message if no articles are found
  if (articles.length === 0) {
    return <div style={styles.container}>No articles found.</div>;
  }

  // Render the list of articles
  return (
    <div style={styles.container}>
      {articles.map((article) => (
        <div key={article.id} style={styles.article}>
          {article.fileUrl && (
            <img
              src={article.fileUrl}
              alt={article.title}
              style={styles.image}
            />
          )}
          <h2 style={styles.title}>{article.title}</h2>
          <p style={styles.date}>
            {new Date(article.date.seconds * 1000).toLocaleDateString()} at{" "}
            {new Date(article.date.seconds * 1000).toLocaleTimeString()}
          </p>
          <p style={styles.abstract}>
            <strong>Abstract:</strong> {article.abstract}
          </p>
          <p style={styles.content}>
            <strong>Content:</strong> {article.content}
          </p>
          <p style={styles.tags}>Tags: {article.tags}</p>
          <CommentSection postId={article.id} />{" "}
          {/* Render the comment section */}
        </div>
      ))}
    </div>
  );
};

export default ArticlesPage;
