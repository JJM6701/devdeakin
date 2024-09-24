import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentSection from "./CommentSection";

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const videoQuery = query(
        collection(db, "posts"),
        where("type", "==", "video")
      );
      const videoSnapshot = await getDocs(videoQuery);
      const videoList = videoSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  const handleView = async (videoId, currentViews) => {
    const videoDoc = doc(db, "posts", videoId);
    await updateDoc(videoDoc, { views: currentViews + 1 });
  };

  const handleLike = async (
    videoId,
    currentLikes,
    likedBy = [],
    dislikedBy = []
  ) => {
    if (!userId) return;

    if (likedBy.includes(userId)) {
      console.log("User has already liked this video.");
      return;
    }

    try {
      const videoDoc = doc(db, "posts", videoId);
      const updatedLikes = currentLikes + 1;
      const updatedLikedBy = [...likedBy, userId];

      let updatedDislikes = dislikedBy.length;
      let updatedDislikedBy = dislikedBy;
      if (dislikedBy.includes(userId)) {
        updatedDislikes -= 1;
        updatedDislikedBy = dislikedBy.filter((id) => id !== userId);
      }

      await updateDoc(videoDoc, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                likes: updatedLikes,
                likedBy: updatedLikedBy,
                dislikes: updatedDislikes,
                dislikedBy: updatedDislikedBy,
              }
            : video
        )
      );

      console.log("Video liked successfully.");
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async (
    videoId,
    currentDislikes,
    likedBy = [],
    dislikedBy = []
  ) => {
    if (!userId) return;

    if (dislikedBy.includes(userId)) {
      console.log("User has already disliked this video.");
      return;
    }

    try {
      const videoDoc = doc(db, "posts", videoId);
      const updatedDislikes = currentDislikes + 1;
      const updatedDislikedBy = [...dislikedBy, userId];

      let updatedLikes = likedBy.length;
      let updatedLikedBy = likedBy;
      if (likedBy.includes(userId)) {
        updatedLikes -= 1;
        updatedLikedBy = likedBy.filter((id) => id !== userId);
      }

      await updateDoc(videoDoc, {
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                dislikes: updatedDislikes,
                dislikedBy: updatedDislikedBy,
                likes: updatedLikes,
                likedBy: updatedLikedBy,
              }
            : video
        )
      );

      console.log("Video disliked successfully.");
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "20px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    videoCard: {
      borderBottom: "1px solid #ddd",
      paddingBottom: "20px",
      marginBottom: "20px",
    },
    video: {
      width: "100%",
      height: "auto",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: "10px 0",
    },
    description: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "10px",
    },
    views: {
      fontSize: "14px",
      color: "#999",
    },
    likeDislikeContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    likeDislikeButton: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    likeCount: {
      marginLeft: "5px",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <h1>Uploaded Videos</h1>
      {videos.map((video) => (
        <div key={video.id} style={styles.videoCard}>
          <h2 style={styles.title}>{video.title}</h2>
          <p style={styles.description}>{video.description}</p>
          <video
            src={video.fileUrl}
            controls
            style={styles.video}
            onPlay={() => handleView(video.id, video.views)}
          />
          <p style={styles.views}>Views: {video.views}</p>
          <div style={styles.likeDislikeContainer}>
            <div
              style={styles.likeDislikeButton}
              onClick={() =>
                handleLike(
                  video.id,
                  video.likes,
                  video.likedBy || [],
                  video.dislikedBy || []
                )
              }
            >
              <ThumbUpIcon
                style={{
                  color: video.likedBy?.includes(userId) ? "blue" : "gray",
                }}
              />
              <span style={styles.likeCount}>{video.likes || 0}</span>
            </div>

            <div
              style={styles.likeDislikeButton}
              onClick={() =>
                handleDislike(
                  video.id,
                  video.dislikes,
                  video.likedBy || [],
                  video.dislikedBy || []
                )
              }
            >
              <ThumbDownIcon
                style={{
                  color: video.dislikedBy?.includes(userId) ? "red" : "gray",
                }}
              />
              <span style={styles.likeCount}>{video.dislikes || 0}</span>
            </div>
          </div>
          <CommentSection postId={video.id} />{" "}
        </div>
      ))}
    </div>
  );
};

export default VideoPage;
