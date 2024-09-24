import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, "posts", postId, "comments");
        const q = query(commentsRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        const commentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComments(commentsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments: ", error);
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    // Fetch the user's first and last name from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    let firstName = "Anonymous";
    let lastName = "";

    if (userDoc.exists()) {
      const userData = userDoc.data();
      firstName = userData.firstName || "Anonymous";
      lastName = userData.lastName || "";
    }

    const commentData = {
      content: newComment,
      date: Timestamp.now(), // Use Firestore's Timestamp for consistency
      createdBy: {
        uid: user.uid,
        firstName,
        lastName,
      },
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
    };

    try {
      const commentsRef = collection(db, "posts", postId, "comments");

      // Add the comment to Firestore and get the generated document reference
      const docRef = await addDoc(commentsRef, commentData);

      // Fetch the newly added comment from Firestore (to get the generated `id`)
      const newCommentDoc = await getDoc(docRef);
      const newCommentData = {
        id: newCommentDoc.id,
        ...newCommentDoc.data(),
      };

      setComments([newCommentData, ...comments]);

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleLikeComment = async (
    commentId,
    likes,
    likedBy = [],
    dislikes,
    dislikedBy = []
  ) => {
    if (!user) return;

    const commentRef = doc(db, "posts", postId, "comments", commentId);

    if (likedBy.includes(user.uid)) {
      console.log("User already liked this comment.");
      return;
    }

    try {
      const updatedLikedBy = [...likedBy, user.uid];
      let updatedDislikedBy = dislikedBy;
      let updatedDislikes = dislikes;

      if (dislikedBy.includes(user.uid)) {
        updatedDislikedBy = dislikedBy.filter((id) => id !== user.uid);
        updatedDislikes -= 1;
      }

      await updateDoc(commentRef, {
        likes: likes + 1,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: likes + 1,
                likedBy: updatedLikedBy,
                dislikes: updatedDislikes,
                dislikedBy: updatedDislikedBy,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislikeComment = async (
    commentId,
    dislikes,
    likedBy = [],
    dislikedBy = []
  ) => {
    if (!user) return;

    const commentRef = doc(db, "posts", postId, "comments", commentId);

    if (dislikedBy.includes(user.uid)) {
      console.log("User already disliked this comment.");
      return;
    }

    try {
      const updatedDislikedBy = [...dislikedBy, user.uid];
      let updatedLikedBy = likedBy;
      let updatedLikes = likedBy.length;

      if (likedBy.includes(user.uid)) {
        updatedLikedBy = likedBy.filter((id) => id !== user.uid);
        updatedLikes -= 1;
      }

      await updateDoc(commentRef, {
        dislikes: dislikes + 1,
        dislikedBy: updatedDislikedBy,
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                dislikes: dislikes + 1,
                dislikedBy: updatedDislikedBy,
                likes: updatedLikes,
                likedBy: updatedLikedBy,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      await deleteDoc(commentRef);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Invalid Date";

    if (date instanceof Timestamp) {
      date = date.toDate();
    }

    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const styles = {
    container: {
      marginTop: "20px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#fff",
    },
    commentInput: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "10px",
      boxSizing: "border-box",
      resize: "vertical",
    },
    commentButton: {
      padding: "10px 20px",
      backgroundColor: "#333",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    commentList: {
      listStyleType: "none",
      paddingLeft: 0,
    },
    commentItem: {
      padding: "10px",
      borderBottom: "1px solid #eee",
    },
    user: {
      fontSize: "14px",
      fontWeight: "bold",
      marginRight: "5px",
    },
    date: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "5px",
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
    deleteButton: {
      color: "red",
      background: "none",
      border: "none",
      cursor: "pointer",
      marginLeft: "10px",
      fontSize: "14px",
    },
    loading: {
      fontStyle: "italic",
      color: "#777",
    },
  };

  return (
    <div style={styles.container}>
      <h3>Comments</h3>
      <textarea
        style={styles.commentInput}
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button style={styles.commentButton} onClick={handleCommentSubmit}>
        Post Comment
      </button>

      {loading ? (
        <p style={styles.loading}>Loading comments...</p>
      ) : (
        <ul style={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} style={styles.commentItem}>
              <div>
                <span style={styles.user}>
                  {comment.createdBy?.firstName} {comment.createdBy?.lastName}
                </span>
                <span style={styles.date}>{formatDate(comment.date)}</span>
                {user && comment.createdBy?.uid === user.uid && (
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p>{comment.content}</p>

              <div style={styles.likeDislikeContainer}>
                <div
                  style={styles.likeDislikeButton}
                  onClick={() =>
                    handleLikeComment(
                      comment.id,
                      comment.likes,
                      comment.likedBy || [],
                      comment.dislikes,
                      comment.dislikedBy || []
                    )
                  }
                >
                  <ThumbUpIcon
                    style={{
                      color: comment.likedBy?.includes(user.uid)
                        ? "blue"
                        : "gray",
                    }}
                  />
                  <span style={styles.likeCount}>{comment.likes || 0}</span>
                </div>

                <div
                  style={styles.likeDislikeButton}
                  onClick={() =>
                    handleDislikeComment(
                      comment.id,
                      comment.dislikes,
                      comment.likedBy || [],
                      comment.dislikedBy || []
                    )
                  }
                >
                  <ThumbDownIcon
                    style={{
                      color: comment.dislikedBy?.includes(user.uid)
                        ? "red"
                        : "gray",
                    }}
                  />
                  <span style={styles.likeCount}>{comment.dislikes || 0}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
