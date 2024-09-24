import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import CommentSection from "./CommentSection";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesRef = collection(db, "posts");
        const q = query(articlesRef, where("type", "==", "article"));
        const querySnapshot = await getDocs(q);

        const articlesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArticles(articlesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles: ", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

  if (loading) {
    return <div style={styles.container}>Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div style={styles.container}>No articles found.</div>;
  }

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

          <CommentSection postId={article.id} />
        </div>
      ))}
    </div>
  );
};

export default ArticlesPage;
