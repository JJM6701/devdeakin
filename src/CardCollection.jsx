import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

const QuestionCard = ({ card, styles }) => {
  const [userFullName, setUserFullName] = useState("Unknown");

  useEffect(() => {
    const fetchUserName = async () => {
      if (card.createdBy) {
        const userDoc = await getDoc(doc(db, "users", card.createdBy));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserFullName(`${userData.firstName} ${userData.lastName}`);
        }
      }
    };

    fetchUserName();
  }, [card.createdBy]);

  const formattedDate = card.date?.toDate
    ? card.date.toDate().toLocaleDateString()
    : "Unknown date";

  const questionCardStyles = {
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#333",
    },
    date: {
      fontSize: "0.9rem",
      color: "#888",
      margin: "10px 0",
    },
    description: {
      fontSize: "1rem",
      lineHeight: "1.5",
      marginBottom: "15px",
      color: "#555",
    },
    tags: {
      fontSize: "0.85rem",
      color: "#0073e6",
      backgroundColor: "#f0f4ff",
      padding: "5px 10px",
      borderRadius: "15px",
      display: "inline-block",
    },
    cardContainer: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      transition: "box-shadow 0.3s ease",
      width: "300px",
      maxWidth: "100%",
      boxSizing: "border-box",
    },
    cardContainerHover: {
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    createdBy: {
      margin: "10px 0",
      fontStyle: "italic",
      color: "#666",
    },
  };

  return (
    <div
      style={questionCardStyles.cardContainer}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          questionCardStyles.cardContainerHover.boxShadow)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          questionCardStyles.cardContainer.boxShadow)
      }
    >
      <h3 style={questionCardStyles.title}>{card.title}</h3>

      <p style={questionCardStyles.createdBy}>{userFullName}</p>

      <p style={questionCardStyles.date}>{formattedDate}</p>

      <p style={questionCardStyles.description}>{card.description}</p>

      {card.tags && (
        <p>
          <span style={questionCardStyles.tags}># {card.tags}</span>
        </p>
      )}
    </div>
  );
};

const ArticleCard = ({ card }) => {
  const [userFullName, setUserFullName] = useState("Unknown");

  useEffect(() => {
    const fetchUserName = async () => {
      if (card.createdBy) {
        const userDoc = await getDoc(doc(db, "users", card.createdBy));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserFullName(`${userData.firstName} ${userData.lastName}`);
        }
      }
    };

    fetchUserName();
  }, [card.createdBy]);

  const formattedDate = card.date?.toDate
    ? card.date.toDate().toLocaleDateString()
    : "Unknown date";

  const articleCardStyles = {
    cardContainer: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      transition: "box-shadow 0.3s ease",
      width: "400px",
      maxWidth: "100%",
      boxSizing: "border-box",
    },
    cardContainerHover: {
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    imageContainer: {
      position: "relative",
      width: "100%",
      paddingBottom: "56.25%",
      overflow: "hidden",
      borderRadius: "5px",
      marginBottom: "15px",
    },
    cardMedia: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#333",
    },
    createdBy: {
      fontStyle: "italic",
      color: "#666",
      marginBottom: "10px",
    },
    date: {
      fontSize: "0.9rem",
      color: "#888",
      marginBottom: "10px",
    },
    abstract: {
      fontSize: "1rem",
      lineHeight: "1.5",
      marginBottom: "15px",
      color: "#555",
    },
    tags: {
      fontSize: "0.85rem",
      color: "#0073e6",
      backgroundColor: "#f0f4ff",
      padding: "5px 10px",
      borderRadius: "15px",
      display: "inline-block",
    },
  };

  return (
    <div
      style={articleCardStyles.cardContainer}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          articleCardStyles.cardContainerHover.boxShadow)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          articleCardStyles.cardContainer.boxShadow)
      }
    >
      <div style={articleCardStyles.imageContainer}>
        <img
          src={card.fileUrl}
          alt={card.title}
          style={articleCardStyles.cardMedia}
        />
      </div>

      <h3 style={articleCardStyles.title}>{card.title}</h3>

      <p style={articleCardStyles.createdBy}>Written by: {userFullName}</p>

      <p style={articleCardStyles.date}>{formattedDate}</p>

      <p style={articleCardStyles.abstract}>{card.abstract}</p>

      {card.tags && (
        <p>
          <span style={articleCardStyles.tags}># {card.tags}</span>
        </p>
      )}
    </div>
  );
};

const VideoCard = ({ card }) => {
  const [userFullName, setUserFullName] = useState("Unknown");

  useEffect(() => {
    const fetchUserName = async () => {
      if (card.createdBy) {
        const userDoc = await getDoc(doc(db, "users", card.createdBy));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserFullName(`${userData.firstName} ${userData.lastName}`);
        }
      }
    };

    fetchUserName();
  }, [card.createdBy]);

  const formattedDate = card.date?.toDate
    ? card.date.toDate().toLocaleDateString()
    : "Unknown date";

  const videoCardStyles = {
    cardContainer: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      transition: "box-shadow 0.3s ease",
      width: "500px",
      maxWidth: "100%",
      boxSizing: "border-box",
    },
    cardContainerHover: {
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    videoContainer: {
      position: "relative",
      width: "100%",
      paddingBottom: "56.25%",
      overflow: "hidden",
      borderRadius: "5px",
      marginBottom: "15px",
    },
    cardMedia: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#333",
    },
    date: {
      fontSize: "0.9rem",
      color: "#888",
      marginBottom: "10px",
    },
    stats: {
      fontSize: "0.9rem",
      color: "#888",
      marginBottom: "10px",
    },
    tags: {
      fontSize: "0.85rem",
      color: "#0073e6",
      backgroundColor: "#f0f4ff",
      padding: "5px 10px",
      borderRadius: "15px",
      display: "inline-block",
    },
  };

  return (
    <div
      style={videoCardStyles.cardContainer}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          videoCardStyles.cardContainerHover.boxShadow)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          videoCardStyles.cardContainer.boxShadow)
      }
    >
      <div style={videoCardStyles.videoContainer}>
        <video
          src={card.fileUrl}
          controls
          style={videoCardStyles.cardMedia}
        ></video>
      </div>

      <h3 style={videoCardStyles.title}>{card.title}</h3>

      <p style={videoCardStyles.date}>Uploaded on: {formattedDate}</p>

      <p style={videoCardStyles.stats}>
        {card.views} views • {card.likes} likes • {card.dislikes} dislikes
      </p>

      {card.tags && (
        <p>
          <span style={videoCardStyles.tags}># {card.tags}</span>
        </p>
      )}
    </div>
  );
};

const CardCollection = ({ collectionName, permalink, postType }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    cardCollection: {
      padding: "30px 10px",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    cardGrid: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    card: {
      padding: "15px",
      width: "300px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    cardMedia: {
      width: "100%",
      height: "auto",
      borderRadius: "2px",
    },
    cardContent: {
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    cardDetails: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
    },
    viewMoreButton: {
      display: "block",
      textAlign: "center",
      width: "fit-content",
      margin: "10px auto",
      padding: "10px 20px",
      backgroundColor: "#b3b1b1",
      color: "black",
      textDecoration: "none",
      borderRadius: "10px",
    },
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("type", "==", postType),
          orderBy("date", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(postsQuery);

        const postsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCards(postsList);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [postType]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const renderCard = (card) => {
    switch (postType) {
      case "question":
        return <QuestionCard key={card.id} card={card} />;
      case "article":
        return <ArticleCard key={card.id} card={card} styles={styles} />;
      case "video":
        return <VideoCard key={card.id} card={card} styles={styles} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.cardCollection}>
      <h2 style={styles.header}>Featured {collectionName}</h2>
      <div style={styles.cardGrid}>
        {cards.slice(0, 3).map((card) => renderCard(card))}
      </div>
      <a href={permalink} style={styles.viewMoreButton}>
        See all {collectionName}
      </a>
    </div>
  );
};

CardCollection.propTypes = {
  collectionName: PropTypes.string.isRequired,
  permalink: PropTypes.string.isRequired,
  postType: PropTypes.string.isRequired,
};

export default CardCollection;
